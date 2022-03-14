import { defineStore } from 'pinia';
import { Resource } from './classes/resource';
import type {
  ResourceQueueType,
  SteamResourceType,
  BasicType,
  QueueType,
} from './main/types';
import { isOfType } from './main/types';
import { StatTracker } from './classes/trackers';
import { OneTimeUpgrades } from './classes/upgrades';
import { linear, upThenDown } from './main/queue-gpt';

const baseConfigFactory = function () {
  return { layer: 1, data: { show: false } } as const;
};
const autoCap = 0.4;
export const useSteamStore = defineStore('steam', {
  state: () => ({
    steam: new Resource(),
    water: new Resource({
      owned: 10,
      req: 1e100, // absurd big number to solve problems
    }) as ResourceQueueType,
    heat: new Resource({ req: 1 }) as ResourceQueueType,
    fill: new Resource({ req: 1 }) as ResourceQueueType,
    isDoing: false,
    statTracker: new StatTracker(['steam']),
    oneUpgrades: {
      stronger: new OneTimeUpgrades(
        'Getting stronger!',
        'Multiplies speed of all resources by 2',
        1,
        1,
        () => true,
        baseConfigFactory()
      ),
      auto: new OneTimeUpgrades(
        'Make a Rube Goldberg machine',
        'Automaticially fills the furnace based on your steam',
        3,
        1,
        () => false,
        baseConfigFactory()
      ),
      help: new OneTimeUpgrades(
        "Welp, that wasn't fun",
        'Changes water gain formula from m/(1 + ce^(-kx)) (gain goes up and down) to linear',
        15,
        1,
        () => false,
        baseConfigFactory()
      ),
    },
  }),
  getters: {
    isUseable(store) {
      return (innerRes: SteamResourceType) => {
        return !store.isDoing && store[innerRes].isEmpty();
      };
    },
    autoFurnaceMulti(store) {
      return Math.min((store.steam.owned + 1) ** 0.5 / 10, autoCap);
    },
  },
  actions: {
    init() {
      const auto = this.oneUpgrades.auto;
      auto.isUnlocked = () => {
        return this.oneUpgrades.stronger.hasBought();
      };
      this.oneUpgrades.help.isUnlocked = () => {
        return auto.hasBought();
      };
      this.fill.queueData.sideEffect = (diff: number) => {
        this.water.owned -= diff;
      };
      this.fill.queueData.canDo = () => {
        return this.water.owned > 0;
      };
      this.water.queueData.gainPerTick = (data: QueueType) => {
        const gain = (
          OneTimeUpgrades.use(this.oneUpgrades.help) ? linear : upThenDown
        )(data);
        return gain;
      };
      auto.data.show = true;
      if (auto.data.show) {
        auto.data.getBonus = () => {
          return (
            (this.autoFurnaceMulti * 100).toFixed(0) +
            '%' +
            (this.autoFurnaceMulti === autoCap ? ' (capped)' : '')
          );
        };
      }
    },
    updateResources(delta: number) {
      const isDoingAttr = [];
      for (const value of Object.values(this)) {
        if (isOfType<ResourceQueueType>(value, 'queueData')) {
          value.update();
          isDoingAttr.push(value.isEmpty(false));
        }
      }
      this.isDoing = isDoingAttr.includes(false);
      if (OneTimeUpgrades.use(this.oneUpgrades.auto)) {
        const multi = this.autoFurnaceMulti;
        if (this.heat.isNotFull && this.heat.queueData.canDo()) {
          const result = this.heat.multi * multi * delta;
          this.heat.owned += result;
          this.heat.queueData.sideEffect(result);
        }
        if (this.fill.isNotFull && this.fill.queueData.canDo()) {
          let result = this.fill.multi * multi * delta;
          result = result > this.water.owned ? this.water.owned : result;
          this.fill.owned += result;
          this.fill.queueData.sideEffect(result);
        }
      }
    },
    getResource(res: SteamResourceType) {
      const value = this[res];
      if (
        this.isUseable(res) &&
        (res === 'fill' ? this.fill.queueData.canDo() : true)
      ) {
        value.addNewQueue(value.multi);
      }
    },
    updateMulti() {
      this.heat.multi = 1 + OneTimeUpgrades.use(this.oneUpgrades.stronger);
      this.fill.multi = 1 + OneTimeUpgrades.use(this.oneUpgrades.stronger);
      this.water.multi = 1 + OneTimeUpgrades.use(this.oneUpgrades.stronger);
    },
    updateFurnace() {
      if (
        this.fill.owned >= this.fill.queueData.req &&
        this.heat.owned >= this.heat.queueData.req
      ) {
        this.fill.owned -= this.fill.queueData.req;
        this.heat.owned -= this.heat.queueData.req;
        this.steam.owned += this.steam.multi;
      }
    },
    loadSaveFromString(path: string, data: BasicType) {
      if (path.match(/queue/gi)) {
        return;
      }
      if (path.match(/.water.req/gi)) {
        data = Infinity;
      }
      Function('state', 'data', 'state' + path + '=data')(this, data);
    },
    update(delta: number) {
      this.updateMulti();
      this.updateResources(delta);
      this.updateFurnace();
      this.statTracker.update({ steam: this.steam });
    },
  },
});
