import { defineStore } from "pinia";
import type {
  SteamResourceType,
  NotificationType,
  GenericObjectType,
  BasicType,
  WithUpgradesType,
} from "./main/types";
import type { TabOptions, InnerTabOptions } from "./main/tabTypes";
import { Steam } from "./classes/content";
import { getTime, copy } from "./main/utils";
import { AchievementTracker, StatTracker } from "./classes/trackers";
import { Upgrades } from "./classes/upgrades";
import { Resource } from "./classes/resource";
import { Keypress } from "./classes/keypress";
import LZString from "lz-string";
export const useStore = defineStore("main", {
  state: () => ({
    steam: new Steam(),
    tab: "business" as TabOptions,
    innerTabs: {
      business: "steam",
      options: "settings",
    } as InnerTabOptions,
    stats: {
      totalTimePlayed: 0,
      achievements: new AchievementTracker(),
    },
    keypresses: new Keypress(),
    modal: "",
    notifications: [] as NotificationType[],
    internals: {
      timestamp: getTime(),
      rafID: 0,
      fps: 0,
      save: "",
      lastSaveTimer: getTime(),
    },
    settings: {
      displayFPS: false,
      maxFPS: 60,
      saveInterval: 10000,
    },
  }),
  getters: {
    isUseable: (store) => (res: "steam", innerRes: SteamResourceType) => {
      const realRes = store[res];
      const inner = realRes[innerRes];
      return (
        inner.queue.length === 0 && !realRes.isDoing && inner.owned < inner.req
      );
    },
    getSave(): string {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const replacer = function (key: string, data: any) {
        if (
          [
            "internals",
            "tab",
            "innerTabs",
            "developer",
            "notifications",
            "modal",
            "keypresses",
          ].includes(key)
        )
          return undefined;
        // including those results that just include return for completeness
        if (data instanceof Steam) {
          return data;
        }
        if (data instanceof StatTracker) {
          return copy(data as unknown as GenericObjectType, ["resList"], false);
        }
        if (data instanceof Upgrades) {
          return copy(data as unknown as GenericObjectType, ["level"], true);
        }
        if (data instanceof Resource) {
          return data;
        }
        if (data instanceof AchievementTracker) {
          return data;
        }
        return data;
      };
      return LZString.compressToBase64(JSON.stringify(this.$state, replacer));
    },
    upgradeIsUnlocked() {
      return (data: { name: string; layer: number; oneTime: boolean }) => {
        const upg = this.getUpg(data);
        return upg.isUnlocked();
      };
    },
    getUpg:
      (store) => (data: { name: string; layer: number; oneTime: boolean }) => {
        let upg: WithUpgradesType = store.steam;
        switch (data.layer) {
          case 1:
            upg = store.steam;
            console.log(data.layer);
            break;
          default:
            console.error("Invalid 'data.layer': " + data.layer);
            break;
        }
        // if rebuyable upgrades exist
        //return upg[data.oneTime ? "oneUpgrades" : "upgrades"][data.name]
        return upg["oneUpgrades"][data.name];
      },
  },
  actions: {
    buyUpgrade(data: { name: string; layer: number; oneTime: boolean }) {
      const upg = this.getUpg(data);
      if (!data.oneTime) {
        //upg.upgrades[data.name].buy();
        console.error("No multi-buy steam upgrades");
      } else {
        upg.buy();
      }
    },
    updateGame() {
      this.steam.update();
    },
    updateNotifications() {
      for (const [num, notify] of this.notifications.entries()) {
        if (Date.now() - notify.time > 5000) {
          this.removeNotify(num);
        }
      }
    },
    notify(text: string) {
      this.notifications.push({
        text: text,
        time: Date.now(),
      });
    },
    removeNotify(id: number) {
      this.notifications.splice(id, 1);
    },
    updateStats(timepassed: number) {
      this.stats.totalTimePlayed += timepassed;
      this.stats.achievements.updateAchieves();
    },
    updateExternal(timepassed: number) {
      this.internals.fps = 1000 / timepassed;
      this.updateStats(timepassed);
      this.internals.timestamp = getTime();
      this.updateSaveGameTick();
      this.updateNotifications();
    },
    updateSaveGameTick() {
      if (
        getTime() - this.internals.lastSaveTimer >
        this.settings.saveInterval
      ) {
        this.saveGame();
        this.internals.lastSaveTimer = getTime();
      }
    },
    hardReset() {
      if (
        !confirm(
          "Are you sure to do this? This will wipe all of your progress!"
        )
      ) {
        return;
      }
      this.$reset();
      this.notify("Succesful hard reset.");
    },
    saveGame() {
      localStorage.setItem("sgsave", this.getSave);
      this.notify("Game saved.");
    },
    loadSave() {
      const performSaveImport = (cache?: {
        stack: Array<string | number>;
        data: BasicType;
      }) => {
        if (typeof cache === "undefined") {
          let loadedSave = "";
          const saveToImport = this.internals.save
            ? this.internals.save
            : localStorage.getItem("sgsave");
          if (!saveToImport) return;
          try {
            loadedSave = JSON.parse(
              LZString.decompressFromBase64(saveToImport) as string
            );
          } catch (e) {
            // validation of save
            console.error(e);
            this.notify("An error occured while importing your save.");
            return;
          }
          // this didn't happen but just in case
          if (loadedSave === null) {
            this.notify("Save is empty or is invalid.");
            return;
          }
          performSaveImport({ stack: [], data: loadedSave });
        } else if (typeof cache.data === "object" && cache.data !== null) {
          const toIter = Array.isArray(cache.data)
            ? cache.data.entries()
            : Object.entries(cache.data);
          for (const [key, data] of toIter) {
            const copyOfCache = cache.stack.slice();
            copyOfCache.push(key);
            performSaveImport({
              stack: copyOfCache,
              data: data,
            });
          }
        } else {
          let getString = "";
          cache.stack.forEach((item: number | string) => {
            const strToPut =
              typeof item === "number" ? `[${item}]` : `.${item}`;
            getString += strToPut;
          });
          // a workaround for now
          if (getString.match(/queue/gi)) {
            return;
          }
          if (getString.match(/.water.req/gi)) {
            cache.data = Infinity;
          }
          Function(
            "state",
            "data",
            "state" + getString + "=data"
          )(this, cache.data);
        }
      };
      performSaveImport();
    },
    mainGameLoop() {
      const timepassed = getTime() - this.internals.timestamp;
      if (timepassed > 1000 / this.settings.maxFPS) {
        this.updateGame();
        this.updateExternal(timepassed);
      }
      this.internals.rafID = requestAnimationFrame(() => {
        this.mainGameLoop();
      });
    },
  },
});
