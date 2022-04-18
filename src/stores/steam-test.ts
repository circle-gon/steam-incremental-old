import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { Resource } from "./classes/resource";
import type { ResourceQueueType } from "./main/types";
import { StatTracker } from "./classes/trackers";
import { OneTimeUpgrades } from "./classes/upgrades";

const baseConfigFactory = function () {
  return { layer: 1, data: { show: false } } as const;
};
const autoCap = 0.4;
export const useSteamStore = defineStore("steam", () => {
  const steam = reactive(new Resource());
  const water = reactive(
    new Resource({
      owned: 10,
      req: 1e100, // absurd big number to solve problems
    }) as ResourceQueueType
  );
  const heat = reactive(new Resource({ req: 1 }) as ResourceQueueType);
  const fill = reactive();
  const isDoing = ref();
  const autoFurnace = ref();
  const statTracker = reactive();
  const oneUpgrades = reactive();

  const state = reactive({
    steam: new Resource(),
    water: new Resource({
      owned: 10,
      req: 1e100, // absurd big number to solve problems
    }) as ResourceQueueType,
    heat: new Resource({ req: 1 }) as ResourceQueueType,
    fill: new Resource({ req: 1 }) as ResourceQueueType,
    isDoing: false,
    autoFurnace: true,
    statTracker: new StatTracker(["steam"]),
    oneUpgrades: {
      stronger: new OneTimeUpgrades(
        "Getting stronger!",
        "Multiplies speed of all resources by 2",
        1,
        1,
        () => true,
        baseConfigFactory()
      ),
      auto: new OneTimeUpgrades(
        "Make a Rube Goldberg machine",
        "Automaticially fills the furnace by a fraction of your multi based on your total steam",
        3,
        1,
        () => false,
        baseConfigFactory()
      ),
    },
  });
  return state;
});
