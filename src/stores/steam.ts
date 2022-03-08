import { defineStore } from 'pinia';
import { Resource } from './classes/resource';
import type {
  ResourceQueueType,
  ConfigType,
  SteamResourceType,
} from './main/types';
import { isOfType } from './main/types';
import { StatTracker } from './classes/trackers';
import { getTime } from './main/utils';
import { OneTimeUpgrades } from './classes/upgrades';

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
    isUseable: (store) => (innerRes: SteamResourceType) => {
      const inner = store[innerRes];
      return (
        inner.queueData.queue.length === 0 &&
        !store.isDoing &&
        inner.owned < inner.queueData.req
      );
    },
  },
  actions: {
    init() {
      this.oneUpgrades.auto.isUnlocked = () => {
        return this.oneUpgrades.stronger.hasBought();
      };
    },
    updateResources() {
      const isDoingAttr = [];
      for (const value of Object.values(this)) {
        if (isOfType<ResourceQueueType>(value, 'queueData')) {
          value.update();
          isDoingAttr.push(value.queueData.queue.length > 0);
        }
      }
      this.isDoing = isDoingAttr.includes(true);
    },
    getResource(res: SteamResourceType) {
      const value = this[res];
      if (
        value.queueData.queue.length === 0 &&
        !this.isDoing &&
        value.owned < value.queueData.req
      ) {
        value.addNewQueue(value.multi);
        this.isDoing = true;
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
    update() {
      this.timestamp = getTime();
      this.updateMulti();
      this.updateResources();
      this.updateFurnace();
      this.statTracker.update({ steam: this.steam });
    },
  },
});
