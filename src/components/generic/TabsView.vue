<template>
  <div>
    <span v-for="tab in tabList" :key="tab.actual">
      <span v-if="tab.shown()">
        <span v-if="mainTab === true">
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
import { useStore } from "@/stores/main";
import type { TabsType } from "@/stores/main/types";
const store = useStore();
defineProps<{
  tabList: TabsType[];
  mainTab: boolean;
}>();
const changeTab = (tab: string) => {
  store.tab = tab;
};
//const shown = computed(() => )
const changeInnerTab = (tab: string) => {
  store.innerTabs[store.tab as keyof typeof store.innerTabs] = tab;
};
</script>
