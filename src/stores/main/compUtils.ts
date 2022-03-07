import { TABS } from './tabs';
import { markRaw } from 'vue';
import type { TabsType, LoreType } from './types';
import { ifUndefThrow } from './utils';
const getComputedTab = function <T extends { [key: string]: object }>(
  tab: keyof T,
  choices: T
) {
  return markRaw(choices[tab]);
};
const getTab = function (tab: string) {
  const val = TABS.find((_tab) => _tab.actual === tab);
  if (val === undefined) {
    throw new Error(`Invalid tab: ${tab}`);
  }
  return val;
};
const getSubtabs = function (tab: string) {
  const val = getTab(tab).subtabs;
  if (val === undefined) {
    throw new Error(`The tab does not have subtabs: ${tab}`);
  }
  return val;
};
const getNextLore = function () {
  let text = 'none';
  const lore = getTab('lore') as TabsType & { lore: LoreType };
  for (const loreItem of lore.lore) {
    if (!loreItem.unlocked()) {
      text = loreItem.textRequire;
      break;
    }
  }
  return text;
};
export { getTab, getSubtabs, getNextLore, getComputedTab };
