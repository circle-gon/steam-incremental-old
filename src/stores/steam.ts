import { defineStore } from 'pinia';
import { Resource } from './compose/resource';
import type {
  ResourceQueueType,
  SteamResourceType,
  QueueType,
} from './main/types';
import { isOfType } from './main/typeUtils';
import { StatTracker } from './classes/trackers';
import { OneTimeUpgrades } from './compose/upgrades';

const baseConfigFactory = function () {
  return { layer: 1, data: { show: false } } as const;
};
const autoCap = 0.4;
export const useSteamStore = defineStore('steam', {
  state: () => ({
    steam: Resource(),
    water: Resource({
      owned: 10,
      req: 1e100, // absurd big number to solve problems
    }) as ResourceQueueType,
    heat: Resource({ req: 1 }) as ResourceQueueType,
    fill: Resource({ req: 1 }) as ResourceQueueType,
    isDoing: false,
    statTracker: new StatTracker(['steam']),
    oneUpgrades: {
      stronger: OneTimeUpgrades(
        'Getting stronger!',
        'Multiplies speed of all resources by 2',
        1,
        1,
        () => true,
        baseConfigFactory()
      ),
      auto: OneTimeUpgrades(
        'Make a Rube Goldberg machine',
        'Automaticially fills the furnace based on your steam',
        3,
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
      this.fill.queueData.sideEffect = (diff: number) => {
        this.water.owned -= diff;
      };
      this.fill.queueData.canDo = () => {
        return this.water.owned > 0;
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
      const track = [0, 0];
      if (OneTimeUpgrades.use(this.oneUpgrades.auto)) {
        const multi = this.autoFurnaceMulti;
        if (this.heat.isNotFull() && this.heat.queueData.canDo()) {
          const result = this.heat.multi * multi * delta;
          this.heat.owned += result;
          track[0] = 1;
        }
        if (this.fill.isNotFull() && this.fill.queueData.canDo()) {
          let result = this.fill.multi * multi * delta;
          this.fill.owned += result;
          track[1] = 1;
        }
      }
      const multi = track.filter((elem) => elem !== 0).length / 2;
      this.steam.owned *= 1 - 0.01 * delta * multi;
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
    update(delta: number) {
      this.updateMulti();
      this.updateResources(delta);
      this.updateFurnace();
      this.statTracker.update({ steam: this.steam });
    },
  },
});
