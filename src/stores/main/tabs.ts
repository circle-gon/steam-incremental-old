import type { TabsType, AchievementType } from './types';
import { useStore } from '../main';
import { Achievement } from '../classes/achievements';

const ACHIEVEMENTS: AchievementType[][] = [
  [
    new Achievement(
      'Work',
      'Get one steam. Reward: [kPoints].',
      'fake url',
      function () {
        const store = useStore();
        return store.steam.statTracker.resources.steam.totalMade > 0;
      },
      5
    ),
  ],
];
const TABS: TabsType[] = [
  {
    display: 'Business',
    actual: 'business',
    subtabs: [
      {
        display: 'Steam',
        actual: 'steam',
        shown() {
          return true;
        },
      },
      {
        display: 'Workers',
        actual: 'workers',
        shown() {
          //      return get(state, "steam","steam").totalMade >= 10
          return true;
        },
      },
    ],
    shown() {
      return true;
    },
  },
  {
    display: 'Stats',
    actual: 'stats',
    shown() {
      return true;
    },
  },
  {
    display: 'Achievements',
    actual: 'achieve',
    shown() {
      return true;
    },
  },
  {
    display: 'Lore',
    actual: 'lore',
    lore: [
      {
        text: 'You were bored, so you decided to make some steam using a hot pot you had at home.',
        unlocked() {
          const store = useStore();
          return store.steam.statTracker.resources.steam.totalMade > 0;
        },
        textRequire: 'Get 1 Steam',
      },
      {
        text: "Trying to fill water and heat back and forth isn't really efficent, so you invented upgrades.",
        unlocked() {
          const store = useStore();
          return store.steam.statTracker.resources.steam.totalMade >= 5;
        },
        textRequire: 'Get 5 Steam',
      },
    ],
    shown() {
      return true;
    },
  },
  {
    display: 'Options',
    actual: 'options',
    subtabs: [
      {
        display: 'Settings',
        actual: 'settings',
        shown() {
          return true;
        },
      },
      {
        display: 'About',
        actual: 'about',
        shown() {
          return true;
        },
      },
      {
        display: 'Changelog',
        actual: 'changelog',
        shown() {
          return true;
        },
      },
    ],
    buttons: [
      [
        {
          type: 'button',
          display: () => 'Save game',
          do: () => {
            const store = useStore();
            store.saveGame();
          },
        },
        {
          type: 'button',
          display: () => 'Export save',
          do: () => {
            const store = useStore();
            store.internals.save = store.getSave;
          },
        },
        {
          type: 'button',
          display: () => 'Import save',
          do: () => {
            const store = useStore();
            store.loadSave();
          },
        },
      ],
      [
        {
          type: 'input',
          display() {
            return 'Save interval: ' + this.other.getValue() + ' secs';
          },
          doInput(value: number) {
            const store = useStore();
            store.settings.saveInterval = value;
          },
          other: {
            min: 10,
            max: 60,
            getValue() {
              const store = useStore();
              return store.settings.saveInterval / 1000;
            },
            result(data: number) {
              return data * 1000;
            },
          },
        },
        {
          type: 'input',
          display() {
            return 'Game loop rate: ' + this.other.getValue() + ' ms';
          },
          doInput(value: number) {
            const store = useStore();
            store.settings.maxFPS = value;
          },
          other: {
            min: 16,
            max: 900,
            getValue() {
              const store = useStore();
              return parseInt((1000 / store.settings.maxFPS).toFixed(0));
            },
            result(data: number) {
              return 1000 / data;
            },
          },
        },
        {
          type: 'button',
          display: () => {
            const store = useStore();
            return (store.settings.displayFPS ? 'Hide' : 'Display') + ' FPS';
          },
          do: () => {
            const store = useStore();
            store.settings.displayFPS = !store.settings.displayFPS;
          },
        },
      ],
      [
        undefined,
        {
          type: 'button',
          display: () => 'HARD RESET',
          do: () => {
            const store = useStore();
            store.hardReset();
          },
        },
      ],
    ],
    shown() {
      return true;
    },
  },
];
export { TABS, ACHIEVEMENTS };
