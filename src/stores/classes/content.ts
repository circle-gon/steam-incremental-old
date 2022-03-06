// main game stuff, the content itself
// a helper function for some stuff
import type {
  ResourceType,
  SteamType,
  ConfigType,
  ResourceQueueType,
  SteamResourceType,
  StatTrackerType,
  OneTimeSteamUpgradeType,
} from '../main/types';
import { isOfType } from '../main/types';
import { Resource } from './resource';
import { OneTimeUpgrades } from './upgrades';
import { StatTracker } from './trackers';
import { getTime } from '../main/utils';
import { useStore } from '@/stores/main';
class Steam implements SteamType {
  steam: ResourceType;
  water: ResourceQueueType;
  fill: ResourceQueueType;
  heat: ResourceQueueType;
  isDoing: boolean;
  timestamp: number;
  //upgrades: SteamUpgradeType;
  statTracker: StatTrackerType;
  oneUpgrades: OneTimeSteamUpgradeType;
  constructor() {
    const baseConfig: ConfigType = { layer: 1 };
    this.steam = new Resource();
    this.water = new Resource({
      owned: 10,
      req: 1e100, // absurd big number to solve problems
    }) as ResourceQueueType;
    this.heat = new Resource({ req: 1 }) as ResourceQueueType;
    this.fill = new Resource({ req: 1 }) as ResourceQueueType;
    this.isDoing = false;
    this.timestamp = getTime();
    this.statTracker = new StatTracker(['steam']);
    this.oneUpgrades = {
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
          const store = useStore();
          return store.steam.oneUpgrades.stronger.hasBought();
        },
        baseConfig
      ),
    };
  }
  updateResources() {
    const isDoingAttr = [];
    for (const value of Object.values(this)) {
      if (isOfType<ResourceQueueType>(value, 'c')) {
        value.update();
        isDoingAttr.push(value.queue.length > 0);
      }
    }
    this.isDoing = isDoingAttr.includes(true);
  }
  getResource(res: SteamResourceType) {
    const value = this[res];
    if (value.queue.length === 0 && !this.isDoing && value.owned < value.req) {
      value.addNewQueue(value.multi);
      this.isDoing = true;
    }
  }
  updateMulti() {
    this.heat.multi = 1 + OneTimeUpgrades.use(this.oneUpgrades.stronger);
    this.fill.multi = 1 + OneTimeUpgrades.use(this.oneUpgrades.stronger);
    this.water.multi = 1 + OneTimeUpgrades.use(this.oneUpgrades.stronger);
  }
  updateFurnace() {
    if (this.fill.owned >= this.fill.req && this.heat.owned >= this.heat.req) {
      this.fill.owned -= this.fill.req;
      this.heat.owned -= this.heat.req;
      this.steam.owned += this.steam.multi;
    }
  }
  update() {
    this.timestamp = getTime();
    this.updateMulti();
    this.updateResources();
    this.updateFurnace();
    this.statTracker.update({ steam: this.steam });
  }
}
export { Steam };
