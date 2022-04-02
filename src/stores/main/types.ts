import type { TabOptionsType, InnerTabOptionsType } from './tabTypes';

// unexported types
type BasicType =
  | string
  | number
  | boolean
  | { [key: string]: BasicType }
  | BasicType[];
type RealSettingButtonType = SettingButtonType | SettingButtonInputType;
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
interface InputType {
  min: number;
  max: number;
  getValue: () => number;
  result: (r: number) => number;
}
interface InnerTabsType extends CoreTabsType {
  actual: InnerTabOptionsType;
}
type SteamResourceType = 'heat' | 'water' | 'fill';
interface AchievementType {
  desc: string;
  hoverText: string;
  img: string;
  isUnlocked: () => boolean;
  bonus: number;
}
interface ResourceType {
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
type UpgradeDataType =
  | { show: false }
  | { show: true; getBonus: () => string };
type GainType = (data: QueueType) => number;
type ResourceQueueType = Required<ResourceType>;
interface ResourceInputType {
  owned?: number;
  multi?: number;
  req?: number;
  k?: number;
  c?: number;
  gainPerTick?: GainType;
  sideEffect?: (diff: number) => void;
  canDo?: () => boolean;
}
interface QueueType {
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
export interface TabsType extends CoreTabsType {
  actual: TabOptionsType;
  subtabs: InnerTabsType[] | [];
}
export interface LoreType {
  text: string;
  unlocked: () => boolean;
  textRequire: string;
}
export interface SettingButtonType {
  type: 'button';
  display: () => string | null;
  do: () => void;
}
export interface SettingButtonInputType {
  type: 'input';
  display: () => string | null;
  doInput: (value: number) => void;
  other: InputType;
}
export interface NotificationType {
  text: string;
  time: number;
}
export type {
  SteamResourceType,
  InnerTabsType,
  AchievementType,
  ResourceType,
  UpgradeDataType,
  GainType,
  ResourceQueueType,
  ResourceInputType,
  QueueType
}