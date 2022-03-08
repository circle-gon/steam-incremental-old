import {defineStore} from 'pinia'
import {Resource} from './classes/resource'
import type {ResourceQueueType, ConfigType} from './main/types'
import {StatTracker} from './classes/trackers'
import {getTime} from './main/utils'
import {OneTimeUpgrades} from './classes/upgrades'

const baseConfig: ConfigType = { layer: 1 };
export const useSteamStore = defineStore("steam", {
  state: () => ({
    steam: new Resource(),
    water: new Resource({
      owned: 10,
      req: 1e100, // absurd big number to solve problems
    }) as ResourceQueueType,
    heat: new Resource({ req: 1 }) as ResourceQueueType,
    fill: new Resource({ req: 1 }) as ResourceQueueType,
    isDoing = false,
    timestamp: getTime(),
    statTracker: new StatTracker(["steam"]),
    oneUpgrades: {
      stronger: new OneTimeUpgrades(
        "Getting stronger!",
        "Multiplies speed of all resources by 2",
        1,
        1,
        () => true,
        baseConfig
      ),
      auto: new OneTimeUpgrades(
        "No one likes working!",
        "Automaticially fills the furnace based on your steam",
        5,
        1,
        () => {
          const store = useStore();
          return store.steam.oneUpgrades.stronger.hasBought();
        },
        baseConfig
      ),
    };
  })
})