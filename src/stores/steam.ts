import { defineStore, acceptHMRUpdate } from 'pinia';
import { Resource } from './classes/resource';
import type {
  ResourceQueueType,
  ConfigType,
  SteamResourceType,
  BasicType,
} from './main/types';
import { isOfType } from './main/types';
import { StatTracker } from './classes/trackers';
import { getTime, getTimePassed } from './main/utils';
import { OneTimeUpgrades } from './classes/upgrades';
import { linear } from './main/queue-gpt';

const baseConfig: ConfigType = { layer: 1 };
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
    timestamp: getTime(),
    statTracker: new StatTracker(['steam']),
    oneUpgrades: {
      stronger: new OneTimeUpgrades(
        'Getting stronger!',
        'Multiplies speed of all resources by 2',
        1,
        1,
        () => true,
        baseConfig
      ),
      auto: new OneTimeUpgrades(
        'No one likes working!',
        'Automaticially fills the furnace based on your steam',
        5,
        1,
        () => {
          return false;
        },
        baseConfig
      ),
    },
  }),
  getters: {
    isUseable() {
      return (innerRes: SteamResourceType) => {
        //console.log(this.isEmpty(innerRes))
        return !this.isDoing && this.isEmpty(innerRes);
      };
    },
    isEmpty: (store) => (innerRes: SteamResourceType, notFull: boolean = true) => {
      const res = store[innerRes];
      return (
        (notFull ? res.owned < res.queueData.req : true) && 
        res.queueData.queue.find((element) => {
          return element.manual === true;
        }) === undefined
      );
    },
  },
  actions: {
    init() {
      this.oneUpgrades.auto.isUnlocked = () => {
        return this.oneUpgrades.stronger.hasBought();
      };
    },
    updateResources(delta: number) {
      const isDoingAttr = []
      for (const [key, value] of Object.entries(this)) {
        if (isOfType<ResourceQueueType>(value, 'queueData')) {
          value.update();
          isDoingAttr.push(this.isEmpty(key, false))
        }
      }
      this.isDoing = isDoingAttr.includes(false)
      if (OneTimeUpgrades.use(this.oneUpgrades.auto)) {
        const multi = (this.steam.owned + 1) ** 0.2
        this.heat.owned += this.heat.multi * multi * delta
        this.fill.owned += this.fill.multi * multi * delta
      }
    },
    getResource(res: SteamResourceType) {
      const value = this[res];
      if (
        value.queueData.queue.length === 0 &&
        !this.isDoing &&
        value.owned < value.queueData.req
      ) {
        value.addNewQueue(value.multi);
      }
    },
    updateMulti() {
      this.heat.multi = 1 + OneTimeUpgrades.use(this.oneUpgrades.stronger);
      this.fill.multi = 1 + OneTimeUpgrades.use(this.oneUpgrades.stronger);
      this.water.multi = 1 + OneTimeUpgrades.use(this.oneUpgrades.stronger)
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
    update() {
      const delta = getTimePassed(this.timestamp)
      this.timestamp = getTime();
      this.updateMulti();
      this.updateResources(delta);
      this.updateFurnace();
      this.statTracker.update({ steam: this.steam });
    },
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSteamStore, import.meta.hot));
}
