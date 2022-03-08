<template>
  <div>
    <span v-for="tab in tabList" :key="tab.actual">
      <span v-if="tab.shown()">
        <span v-if="'subtabs' in tab">
          <button @click="changeTab(tab.actual)">
            {{ tab.display }}
          </button>
        </span>
        <span v-else>
          <button class="innertab" @click="changeInnerTab(tab.actual)">
            {{ tab.display }}
          </button>
        </span>
      </span>
    </span>
  </div>
</template>
<script setup lang="ts">
import { useStore } from '@/stores/main';
import type { TabsType, InnerTabsType } from '@/stores/main/types';
import type {
  TabOptionsType,
  InnerTabKeysType,
  BUSINESS_TAB_LIST_TYPE as BSTYPE,
  OPTIONS_TAB_LIST_TYPE as OSTYPE,
} from '@/stores/main/tabTypes';
import {
  BUSINESS_TAB_LIST as BS,
  OPTIONS_TAB_LIST as OS,
} from '@/stores/main/tabTypes';
const store = useStore();
defineProps<{
  tabList: TabsType[] | InnerTabsType[];
  mainTab: boolean;
}>();
const changeTab = (tab: TabOptionsType) => {
  store.tab = tab;
};

const changeInnerTab = (tab: unknown) => {
  function isInInnerTabs(otab: string): otab is InnerTabKeysType {
    return otab in store.innerTabs;
  }
  function isCertainStr<T>(str: T, tlist: Readonly<T[]>): str is T {
    return tlist.includes(str as T);
  }
  if (isInInnerTabs(store.tab)) {
    if (isCertainStr<keyof BSTYPE>(tab, BS) && store.tab === 'business') {
      store.innerTabs[store.tab] = tab;
    } else if (isCertainStr<keyof OSTYPE>(tab, OS) && store.tab === 'options') {
      store.innerTabs[store.tab] = tab;
    } else {
      throw new Error(`Not a valid type: ${tab}`);
    }
  } else {
    throw new Error(`Tab ${store.tab} does not have a inner tab.`);
  }
};
</script>
