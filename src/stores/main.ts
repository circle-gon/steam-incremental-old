import { defineStore, acceptHMRUpdate } from 'pinia';
import type { StateTree } from 'pinia';
import type { GenericObjectType, OneTimeSteamUpgradeType } from './main/types';
import { getTime, copy, deepReplace, getTimePassed } from './main/utils';
import { isObject } from './main/typeUtils';
import { StatTracker } from './classes/trackers';
import { Upgrades } from './classes/upgrades';
import { Resource } from './classes/resource';
import LZString from 'lz-string';
import { useSteamStore } from './steam';
import { useTabsStore } from './tabs';
import { useNotificationStore } from './notifications';
import { useStatsStore } from './stats';

const useStore = defineStore('main', {
  state: () => ({
    // modal stuff (but really small)
    modal: '',
    // notifications stuff
    // other 'internal' stuff but should be split into the other stores
    // to not use use[xxxx]Store for everything
    keypresses: new Set<string>(),
    internals: {
      timestamp: getTime(),
      rafID: 0,
      fps: 0,
      save: '',
      lastSaveTimer: getTime(),
    },

    // too small for now to consider moving it to another store
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
        if (['internals', 'modal'].includes(key)) return undefined;
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
        return data;
      };
      const save: { [key: string]: StateTree } = {
        settings: {
          ...this.settings,
        },
      };
      Object.entries(REPLACE_PATH).forEach((entries) => {
        save[entries[0]] = entries[1]().$state;
      });
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
        } else if (isOneUpgrades(data.name, real)) {
          real[data.name].buy();
        }
      }
    },
    init(load = true) {
      const store = useSteamStore();
      store.init();
      if (load) {
        this.loadSave();
      }
    },
    updateGame(delta: number) {
      const steam = useSteamStore();
      steam.update(delta);
    },
    updateStats(timepassed: number) {
      const statsStore = useStatsStore();
      statsStore.totalTimePlayed += timepassed;
      statsStore.updateAchieves();
    },
    updateExternal(timepassed: number) {
      this.internals.fps = 1 / timepassed;
      this.updateStats(timepassed);
      this.internals.timestamp = getTime();
      this.updateSaveGameTick();
      useNotificationStore().updateNotifications();
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
      Object.values(ALL_STORES).forEach((store) => {
        store().$reset();
      });
      useSteamStore().$reset();
      this.init(false);
      useNotificationStore().notify('Succesful hard reset.');
    },
    saveGame() {
      localStorage.setItem('sgsave', this.getSave);
      useNotificationStore().notify('Game saved.');
    },
    loadSave() {
      let loadedSave = {};
      const saveToImport = this.internals.save
        ? this.internals.save
        : localStorage.getItem('sgsave');
      if (!saveToImport) return;
      try {
        loadedSave = JSON.parse(
          LZString.decompressFromBase64(saveToImport) || ''
        );
      } catch (e) {
        // validation of save
        console.error(e);
        useNotificationStore().notify(
          'An error occured while importing your save.'
        );
        return;
      }
      // this didn't happen but just in case
      if (loadedSave === null) {
        useNotificationStore().notify('Save is empty or is invalid.');
        return;
      }
      deepReplace(
        this,
        loadedSave,
        <T extends Q, Q extends object>(obj: T, data: Q, key: keyof Q) => {
          const str = Object.keys(REPLACE_PATH).find((element) => {
            return element === key;
          }) as keyof typeof REPLACE_PATH;
          //debugger
          const val = data[key];
          if (str !== undefined && isObject(val)) {
            deepReplace(REPLACE_PATH[str](), val);
            return true;
          }
          return false;
        }
      );
    },
    mainGameLoop() {
      const timepassed = getTimePassed(this.internals.timestamp);
      if (timepassed > 1 / this.settings.maxFPS) {
        this.updateGame(timepassed);
        this.updateExternal(timepassed);
      }
      this.internals.rafID = requestAnimationFrame(() => {
        this.mainGameLoop();
      });
    },
  },
});

// store data
const KEEP_STORES = ['steam', 'stats'];
const ALL_STORES = {
  steam: useSteamStore,
  tabs: useTabsStore,
  notify: useNotificationStore,
  stats: useStatsStore,
};
const REPLACE_PATH = Object.fromEntries(
  Object.entries(ALL_STORES).filter((item) => KEEP_STORES.includes(item[0]))
);

// hot reloading
function isImportHot(hot: unknown): hot is Required<ImportMeta>['hot'] {
  return typeof hot === 'object' && hot !== null && !Array.isArray(hot);
}
const hot = import.meta.hot;
if (hot && isImportHot(hot)) {
  const hotModules = [...Object.values(ALL_STORES), useStore];
  for (const md of hotModules) {
    hot.accept(acceptHMRUpdate(md, import.meta.hot));
  }
  hot.accept((m) => {
    if (!m.useSteamStore) return;
    console.log('[dev]: hot reload steam.ts -> init');
    // hot
    useSteamStore().init();
  });
}

export {
  useStore,
  useSteamStore,
  // prevent ts-prune from erroring on the functions below
  // ts-prune-ignore-next
  useTabsStore,
  // ts-prune-ignore-next
  useStatsStore,
  // ts-prune-ignore-next
  useNotificationStore,
};
