// upgrade type, lore type, tabs type
import type { TabOptions } from "./tabTypes";
export type FilteredKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];
export function isOfType<T>(test: T, prop: keyof T): test is T {
  return (test as T)[prop] !== undefined;
}
export type SteamResourceType = FilteredKeys<SteamType, ResourceQueueType>;
export interface SteamType {
  steam: ResourceType;
  heat: ResourceQueueType;
  water: ResourceQueueType;
  fill: ResourceQueueType;
  isDoing: boolean;
  getResource: (res: SteamResourceType) => void;
  updateResources: () => void;
  updateFurnace: () => void;
  update: () => void;
  updateMulti: () => void;
  statTracker: StatTrackerType;
  timestamp: number;
  //upgrades: SteamUpgradeType;
  oneUpgrades: OneTimeSteamUpgradeType;
}
export interface WithUpgradesType {
  oneUpgrades: OneTimeSteamUpgradeType;
}
export interface AchievementType {
  desc: string;
  hoverText: string;
  img: string;
  isUnlocked: () => boolean;
  bonus: number;
}
export interface ResourceType {
  owned: number;
  multi: number;
  update: () => void;
  addNewQueue: (drain: number) => void;
  req?: number;
  k?: number;
  c?: number;
  queue?: QueueType[];
}
export type ResourceQueueType = Required<ResourceType>;
export interface ResourceInputType {
  owned?: number;
  multi?: number;
  req?: number;
  k?: number;
  c?: number;
}
export interface QueueType {
  remain: number;
  onStart: number;
  time: number;
  drainFactor: number;
  c: number;
  lastRemain: number;
}
export interface ConfigType {
  layer: number;
  maxLevel?: number;
}
export interface OneTimeConfigType {
  layer: number;
}
interface CoreUpgradeType {
  name: string;
  desc: string;
  isUnlocked: () => boolean;
  layer: number;
  level: number;
  maxLevel: number;
  isUnbuyable: () => boolean;
  getCurrentPrice: () => number;
  getPriceDisplay: () => string;
  isMaxLevel: () => boolean;
  getCurrency: () => number;
  getResource: () => string;
  buy: () => void;
  hasBought: () => boolean;
}
export interface UpgradeType extends CoreUpgradeType {
  getPrice: (level: number) => number;
  getEffect: (level: number) => number;
}
export interface OneTimeUpgradeType extends CoreUpgradeType {
  getPrice: () => number;
  getEffect: () => number;
}
export interface GenericObjectType {
  [key: string]: BasicType;
}
export type BasicType =
  | string
  | number
  | boolean
  | { [key: string]: BasicType }
  | BasicType[];
export interface SteamUpgradeType {
  [key: string]: UpgradeType;
}
export interface OneTimeSteamUpgradeType {
  [key: string]: OneTimeUpgradeType;
}
export interface TrackType {
  [key: string]: {
    totalMade: number;
    currentAmt: number;
  };
}
export interface ContentType {
  [key: string]: {
    owned: number;
  };
}
export interface StatTrackerType {
  resList: string[];
  resources: TrackType;
  update: (content: ContentType) => void;
}
interface CoreTabsType {
  display: string;
  actual: string;
  shown: () => boolean;
  lore?: LoreType[];
  buttons?: Array<RealSettingButtonType | undefined>[];
  subtabs?: CoreTabsType[];
}
export interface TabsType extends CoreTabsType {
  actual: TabOptions;
}
export interface InputType {
  min: number;
  max: number;
  getValue: () => number;
  result: (r: number) => number;
}
export interface LoreType {
  text: string;
  unlocked: () => boolean;
  textRequire: string;
}
export interface AchievementTrackerType {
  achievesUnlocked: number[];
  knowPoints: number;
  updateAchieves: () => void;
  hasAchieve: (row: number, col: number) => boolean;
}
export interface SettingButtonType {
  type: "button";
  display: () => string | null;
  do: () => void;
}
export interface SettingButtonInputType {
  type: "input";
  display: () => string | null;
  doInput: (value: number) => void;
  other: InputType;
}
export type RealSettingButtonType = SettingButtonType | SettingButtonInputType;

export interface NotificationType {
  text: string;
  time: number;
}
export interface KeypressClassType {
  keypresses: Set<string>;
  keydown: (e: KeyboardEvent) => void;
  keyup: (e: KeyboardEvent) => void;
  clear: () => void;
}
