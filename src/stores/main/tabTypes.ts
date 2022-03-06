export interface BUSINESS_TAB_LIST {
  workers: object;
  steam: object;
}
export interface OPTIONS_TAB_LIST {
  settings: object
  about: object
  changelog: object
}
export type TabOptions = keyof InnerTabOptions | "lore" | "stats" | "achieve"
export type InnerTabOptions = {
  business: keyof BUSINESS_TAB_LIST,
  options: keyof OPTIONS_TAB_LIST
};
