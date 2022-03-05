import { TABS } from "./tabs";
import { markRaw } from "vue";
import type { TabsType, LoreType } from "./types";
const getComputedTab = function <T>(tab: keyof T, choices: T) {
  return markRaw(choices[tab] as unknown as object);
};
const getTab = function (tab: string) {
  return TABS.find((_tab) => _tab.actual === tab) as TabsType;
};
const getSubtabs = function (tab: string) {
  return getTab(tab).subtabs as TabsType[];
};
const getNextLore = function () {
  let text = "none";
  const lore = getTab("lore") as TabsType & { lore: LoreType };
  for (const loreItem of lore.lore) {
    if (!loreItem.unlocked()) {
      text = loreItem.textRequire;
      break;
    }
  }
  return text;
};
export { getTab, getSubtabs, getNextLore, getComputedTab };
