import { defineStore } from "pinia";
import type {
  TabOptionsType,
  InnerTabOptionsListType,
  InnerTabKeysType,
  BUSINESS_TAB_LIST_TYPE as BSTYPE,
  OPTIONS_TAB_LIST_TYPE as OSTYPE,
} from "./main/tabTypes";
import {
  BUSINESS_TAB_LIST as BS,
  OPTIONS_TAB_LIST as OS,
} from "./main/tabTypes";

export const useTabsStore = defineStore("tabs", {
  state: () => ({
    tab: "business" as TabOptionsType,
    innerTabs: {
      business: "steam",
      options: "settings",
    } as InnerTabOptionsListType,
  }),
  actions: {
    changeInnerTab(to: string) {
      function isCertainStr<T extends string>(
        str: string,
        tlist: Readonly<T[]>
      ): str is T {
        return tlist.includes(str as T);
      }
      const isInInnerTabs = (otab: string): otab is InnerTabKeysType => {
        return otab in this.innerTabs;
      };
      if (!isInInnerTabs(this.tab))
        throw new Error(
          `Invalid mutation of store: tab ${this.tab} does not have a inner tab.`
        );
      else if (this.tab === "business") {
        if (!isCertainStr<keyof BSTYPE>(to, BS))
          throw new Error(`Invalid inner tab setting: ${to}.`);
        this.innerTabs[this.tab] = to;
      } else if (this.tab === "options") {
        if (!isCertainStr<keyof OSTYPE>(to, OS))
          throw new Error(`Invalid inner tab setting: ${to}.`);
        this.innerTabs[this.tab] = to;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _checkedAll: never = this.tab;
        throw new Error(`Tab ${this.tab} does not have a inner tab.`);
      }
    },
  },
});
