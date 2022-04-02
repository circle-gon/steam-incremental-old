import type { TabOptionsType, InnerTabOptionsType } from "./tabTypes";

// util types
export function isOfType<T>(test: T, prop: keyof T): test is T {
  return (test as T)[prop] !== undefined;
}

// unexported types
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
  getStore: () => { owned: number };
  getResource: () => string;
  buy: () => void;
  hasBought: () => boolean;
  data: UpgradeDataType;
}
interface CoreTabsType {
  display: string;
  actual: string;
  shown: () => boolean;
  lore?: LoreType[];
  buttons?: Array<RealSettingButtonType | undefined>[];
}
export type SteamResourceType = "heat" | "water" | "fill";
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
  queueData?: {
    req: number;
    k: number;
    c: number;
    queue: QueueType[];
    gainPerTick: GainType;
    sideEffect: (diff: number) => void;
    canDo: () => boolean;
  };
  isEmpty: (shouldEmpty?: boolean) => boolean;
  isNotFull: boolean;
}
export type UpgradeDataType =
  | { show: false }
  | { show: true; getBonus: () => string };
export type GainType = (data: QueueType) => number;
export type ResourceQueueType = Required<ResourceType>;
export interface ResourceInputType {
  owned?: number;
  multi?: number;
  req?: number;
  k?: number;
  c?: number;
  gainPerTick?: GainType;
  sideEffect?: (diff: number) => void;
  canDo?: () => boolean;
}
export interface QueueType {
  remain: number;
  onStart: number;
  time: number;
  drainFactor: number;
  c: number;
  lastRemain: number;
  manual: boolean;
}
export interface CoreConfigType {
  layer: number;
  data: UpgradeDataType;
}
export interface ConfigType extends CoreConfigType {
  maxLevel?: number;
}
export type OneTimeConfigType = CoreConfigType;
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
export type GenericArrayType = BasicType[];
export type GenericObjectTypeType = GenericArrayType | GenericObjectType;
export type BasicType =
  | string
  | number
  | boolean
  | { [key: string]: BasicType }
  | BasicType[];
export interface OneTimeSteamUpgradeType {
  stronger: OneTimeUpgradeType;
  auto: OneTimeUpgradeType;
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
export interface InnerTabsType extends CoreTabsType {
  actual: InnerTabOptionsType;
}
export interface TabsType extends CoreTabsType {
  actual: TabOptionsType;
  subtabs: InnerTabsType[] | [];
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
