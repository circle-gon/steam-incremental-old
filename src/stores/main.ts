import { defineStore, acceptHMRUpdate } from 'pinia';
import type {
  NotificationType,
  GenericObjectType,
  BasicType,
  OneTimeSteamUpgradeType,
} from './main/types';
import type { TabOptionsType, InnerTabOptionsListType } from './main/tabTypes';
import { getTime, copy, inRP } from './main/utils';
import { AchievementTracker, StatTracker } from './classes/trackers';
import { Upgrades } from './classes/upgrades';
import { Resource } from './classes/resource';
import { Keypress } from './classes/keypress';
import LZString from 'lz-string';
import { useSteamStore } from './steam';
export const useStore = defineStore('main', {
  state: () => ({
    // tabs stuff
    tab: 'business' as TabOptionsType,
    innerTabs: {
      business: 'steam',
      options: 'settings',
    } as InnerTabOptionsListType,

    // stats stuff
    stats: {
      totalTimePlayed: 0,
      // may replace with store
      achievements: new AchievementTracker(),
    },
    // may replace with store
    keypresses: new Keypress(),

    // modal stuff (but really small)
    modal: '',
    // notifications stuff
    notifications: [] as NotificationType[],
    // other 'internal' stuff but should be split into the other stores
    // to not use use[xxxx]Store for everything
    internals: {
      timestamp: getTime(),
      rafID: 0,
      fps: 0,
      save: '',
      lastSaveTimer: getTime(),
    },
    settings: {
      displayFPS: false,
      maxFPS: 60,
      saveInterval: 10000,
    },
  }),
  getters: {
    getSave(): string {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const replacer = function (key: string, data: any) {
        if (
          [
            'internals',
            'tab',
            'innerTabs',
            'developer',
            'notifications',
            'modal',
            'keypresses',
          ].includes(key)
        )
          return undefined;
        // including those results that just include return for completeness
        if (data instanceof StatTracker) {
          return copy(data as unknown as GenericObjectType, ['resList'], false);
        }
        if (data instanceof Upgrades) {
          return copy(data as unknown as GenericObjectType, ['level'], true);
        }
        if (data instanceof Resource) {
          return data;
        }
        if (data instanceof AchievementTracker) {
          return data;
        }
        return data;
      };
      const save = {
        ...this.$state,
        steam: {
          ...useSteamStore().$state,
        },
      };
      return LZString.compressToBase64(JSON.stringify(save, replacer));
    },
    getData: () => (layer: number) => {
      switch (layer) {
        case 1:
          return useSteamStore();
        default:
          console.error('invalid layer: ' + layer);
      }
    },
  },
  actions: {
    buyUpgrade(data: { name: string; layer: number; oneTime: boolean }) {
      const layer = this.getData(data.layer);
      function isOneUpgrades(
        name: string,
        upgs: OneTimeSteamUpgradeType
      ): name is keyof OneTimeSteamUpgradeType {
        return name in upgs;
      }
      if (layer === undefined) {
        console.error('Invalid data.layer: ' + data.layer);
      } else {
        if (!data.oneTime) {
          //upg.upgrades[data.name].buy();
          console.error('No multi-buy steam upgrades');
        } else if (isOneUpgrades(data.name, layer.oneUpgrades)) {
          layer.oneUpgrades[data.name].buy();
        }
      }
    },
    init(load: boolean = true) {
      const store = useSteamStore();
      store.init();
      if (load) {
        this.loadSave();
      }
    },
    updateGame() {
      const steam = useSteamStore();
      steam.update();
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
          'Are you sure to do this? This will wipe all of your progress!'
        )
      ) {
        return;
      }
      this.$reset();
      useSteamStore().$reset();
      this.init(false);
      this.notify('Succesful hard reset.');
    },
    saveGame() {
      localStorage.setItem('sgsave', this.getSave);
      this.notify('Game saved.');
    },
    loadSave() {
      const performSaveImport = (cache?: {
        stack: Array<string | number>;
        data: BasicType;
      }) => {
        if (typeof cache === 'undefined') {
          let loadedSave = '';
          const saveToImport = this.internals.save
            ? this.internals.save
            : localStorage.getItem('sgsave');
          if (!saveToImport) return;
          try {
            loadedSave = JSON.parse(
              LZString.decompressFromBase64(saveToImport) as string
            );
          } catch (e) {
            // validation of save
            console.error(e);
            this.notify('An error occured while importing your save.');
            return;
          }
          // this didn't happen but just in case
          if (loadedSave === null) {
            this.notify('Save is empty or is invalid.');
            return;
          }
          performSaveImport({ stack: [], data: loadedSave });
        } else if (typeof cache.data === 'object' && cache.data !== null) {
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
          let getString = '';
          cache.stack.forEach((item: number | string) => {
            const strToPut =
              typeof item === 'number' ? `[${item}]` : `.${item}`;
            getString += strToPut;
          });
          // a workaround for now
          const inOthers = inRP(getString);
          if (inOthers) {
            getString = getString.replace(inOthers, '');
            useSteamStore().loadSaveFromString(getString, cache.data);
          } else {
            Function(
              'state',
              'data',
              'state' + getString + '=data'
            )(this, cache.data);
          }
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
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
