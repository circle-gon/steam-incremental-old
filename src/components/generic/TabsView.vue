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
import { useTabsStore } from "@/stores/main";
import type { TabsType, InnerTabsType } from "@/stores/main/types";
import type { TabOptionsType } from "@/stores/main/tabTypes";
defineProps<{
  tabList: TabsType[] | InnerTabsType[];
}>();
const changeTab = (tab: TabOptionsType) => {
  useTabsStore().tab = tab;
};

const changeInnerTab = (tab: string) => {
  useTabsStore().changeInnerTab(tab);
};
</script>
