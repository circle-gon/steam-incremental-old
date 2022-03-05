<template>
  <div class="tab-display">
    <br />
    <tabs-view :tab-list="tabs" :main-tab="false" />
    <component :is="innerTab" />
  </div>
</template>
<script setup lang="ts">
import { getSubtabs, getComputedTab } from "@/stores/main/compUtils";
import { useStore } from "@/stores/main";
import { computed } from "vue";
import TabsView from "../generic/TabsView.vue";
import SteamSubtab from "../subtabs/SteamSubtab.vue";
import WorkerSubtab from "../subtabs/WorkerSubtab.vue";
const store = useStore();
const tabs = getSubtabs("business");
const TABS_LIST = {
  workers: WorkerSubtab,
  steam: SteamSubtab,
};
const innerTab = computed(() =>
  getComputedTab(store.innerTabs.business as keyof typeof TABS_LIST, TABS_LIST)
);
</script>
