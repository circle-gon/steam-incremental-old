import type { TabOptionsType, InnerTabOptionsType } from "./tabTypes";

// unexported types

// generic types
type BasicType =
  | string
  | number
  | boolean
  | { [key: string]: BasicType }
  | BasicType[];
interface GenericObjectType {
  [key: string]: BasicType;
}

// setting buttons
interface InputType {
  min: number;
  max: number;
  getValue: () => number;
  result: (r: number) => number;
}
interface SettingButtonType {
  type: "button";
  display: () => string | null;
  do: () => void;
}
interface SettingButtonInputType {
  type: "input";
  display: () => string | null;
  doInput: (value: number) => void;
  other: InputType;
}
type RealSettingButtonType = SettingButtonType | SettingButtonInputType;

// upgrades
type UpgradeDataType = { show: false } | { show: true; getBonus: () => string };
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
// types of upgrades
interface UpgradeType extends CoreUpgradeType {
  getPrice: (level: number) => number;
  getEffect: (level: number) => number;
}
interface OneTimeUpgradeType extends CoreUpgradeType {
  getPrice: () => number;
  getEffect: () => number;
}

// upgrade config
interface CoreConfigType {
  layer: number;
  data: UpgradeDataType;
}
interface ConfigType extends CoreConfigType {
  maxLevel?: number;
}
type OneTimeConfigType = CoreConfigType;

// tabs
interface CoreTabsType {
  display: string;
  actual: string;
  shown: () => boolean;
  lore?: LoreType[];
  buttons?: Array<RealSettingButtonType | undefined>[];
}
interface InnerTabsType extends CoreTabsType {
  actual: InnerTabOptionsType;
}
interface TabsType extends CoreTabsType {
  actual: TabOptionsType;
  subtabs: InnerTabsType[] | [];
}

// steam types
type SteamResourceType = "heat" | "water" | "fill";
interface OneTimeSteamUpgradeType {
  stronger: OneTimeUpgradeType;
  auto: OneTimeUpgradeType;
}

// resource types
interface QueueType {
  remain: number;
  onStart: number;
  time: number;
  drainFactor: number;
  c: number;
  lastRemain: number;
  manual: boolean;
}
type GainType = (data: QueueType) => number;
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

// stat tracker types
interface TrackType {
  [key: string]: {
    totalMade: number;
    currentAmt: number;
  };
}
interface ContentType {
  [key: string]: {
    owned: number;
  };
}
interface StatTrackerType {
  resList: string[];
  resources: TrackType;
  update: (content: ContentType) => void;
}

// misc stuff
interface AchievementType {
  desc: string;
  hoverText: string;
  img: string;
  isUnlocked: () => boolean;
  bonus: number;
}
interface LoreType {
  text: string;
  unlocked: () => boolean;
  textRequire: string;
}
interface NotificationType {
  text: string;
  time: number;
}
/*export type {
  SteamResourceType,
  InnerTabsType,
  AchievementType,
  ResourceType,
  UpgradeDataType,
  GainType,
  ResourceQueueType,
  ResourceInputType,
  QueueType,
  CoreConfigType,
  ConfigType,
  OneTimeConfigType,
  UpgradeType,
  OneTimeUpgradeType,
  GenericObjectType,
  OneTimeSteamUpgradeType,
  TrackType,
  ContentType,
  StatTrackerType,
  TabsType,
  LoreType,
  SettingButtonType,
  SettingButtonInputType,
  NotificationType,
};*/
export type {
  // prevent ts-prune from erroring the isTypeSupported below
  // generic types
  GenericObjectType,
  // setting buttons (below)
  // ts-prune-ignore-next
  SettingButtonType,
  // ts-prune-ignore-next
  SettingButtonInputType,
  // upgrades
  UpgradeDataType,
  // types of upgrades
  UpgradeType,
  OneTimeUpgradeType,
  // configs
  CoreConfigType,
  ConfigType,
  OneTimeConfigType,
  // tab types
  // ts-prune-ignore-next
  InnerTabsType,
  TabsType,
  // steam types
  SteamResourceType,
  OneTimeSteamUpgradeType,
  // resource types
  QueueType,
  GainType,
  ResourceType,
  ResourceQueueType,
  ResourceInputType,
  // stat tracker types
  TrackType,
  ContentType,
  StatTrackerType,
  // misc types
  AchievementType,
  LoreType,
  NotificationType,
};
