<template>
  <div class="tab-display">
    <br />
    <tabs-view :tab-list="tabs" />
    <component :is="innerTab" />
  </div>
</template>
<script setup lang="ts">
import { useTabsStore } from "@/stores/main";
import { computed } from "vue";
import TabsView from "../generic/TabsView.vue";
import SettingsSubtab from "../subtabs/SettingsSubtab.vue";
import AboutSubtab from "../subtabs/AboutSubtab.vue";
import ChangelogSubtab from "../subtabs/ChangelogSubtab.vue";
import type { OPTIONS_TAB_LIST_TYPE } from "@/stores/main/tabTypes";
import { getSubtabs, getComputedTab } from "@/stores/main/compUtils";
const TABS_LIST: OPTIONS_TAB_LIST_TYPE = {
  settings: SettingsSubtab,
  about: AboutSubtab,
  changelog: ChangelogSubtab,
};
const innerTab = computed(() =>
  getComputedTab(useTabsStore().innerTabs.options, TABS_LIST)
);
const tabs = getSubtabs("options");
</script>
