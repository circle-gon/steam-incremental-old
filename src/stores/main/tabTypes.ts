export const BUSINESS_TAB_LIST = ["workers", "steam"] as const;
export type BUSINESS_TAB_LIST_TYPE = Record<
  typeof BUSINESS_TAB_LIST[number],
  object
>;
export const OPTIONS_TAB_LIST = ["settings", "about", "changelog"] as const;
export type OPTIONS_TAB_LIST_TYPE = Record<
  typeof OPTIONS_TAB_LIST[number],
  object
>;
export type InnerTabKeysType = keyof InnerTabOptionsListType;
export type InnerTabOptionsType =
  | keyof BUSINESS_TAB_LIST_TYPE
  | keyof OPTIONS_TAB_LIST_TYPE;
export type TabOptionsType = InnerTabKeysType | "lore" | "stats" | "achieve";
export type InnerTabOptionsListType = {
  business: keyof BUSINESS_TAB_LIST_TYPE;
  options: keyof OPTIONS_TAB_LIST_TYPE;
};
