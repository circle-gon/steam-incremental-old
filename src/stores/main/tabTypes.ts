const BUSINESS_TAB_LIST = ['workers', 'steam'] as const;
type BUSINESS_TAB_LIST_TYPE = Record<typeof BUSINESS_TAB_LIST[number], object>;
const OPTIONS_TAB_LIST = ['settings', 'about', 'changelog'] as const;
type OPTIONS_TAB_LIST_TYPE = Record<typeof OPTIONS_TAB_LIST[number], object>;
type InnerTabOptionsType =
  | keyof BUSINESS_TAB_LIST_TYPE
  | keyof OPTIONS_TAB_LIST_TYPE;
type InnerTabOptionsListType = {
  business: keyof BUSINESS_TAB_LIST_TYPE;
  options: keyof OPTIONS_TAB_LIST_TYPE;
};
type InnerTabKeysType = keyof InnerTabOptionsListType;
type TabOptionsType = InnerTabKeysType | 'lore' | 'stats' | 'achieve';
type MAIN_TAB_LIST_TYPE = Record<TabOptionsType, object>;

export { BUSINESS_TAB_LIST, OPTIONS_TAB_LIST };

export type {
  BUSINESS_TAB_LIST_TYPE,
  MAIN_TAB_LIST_TYPE,
  OPTIONS_TAB_LIST_TYPE,
  InnerTabOptionsType,
  TabOptionsType,
  InnerTabKeysType,
  InnerTabOptionsListType,
};
