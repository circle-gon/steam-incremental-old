<template>
  <div class="tab-display">
    <br />
    <tabs-view :tab-list="tabs" :main-tab="false" />
    <component :is="innerTab" />
  </div>
</template>
<script setup lang="ts">
import { useStore } from '@/stores/main';
import { computed } from 'vue';
import TabsView from '../generic/TabsView.vue';
import SettingsSubtab from '../subtabs/SettingsSubtab.vue';
import AboutSubtab from '../subtabs/AboutSubtab.vue';
import ChangelogSubtab from '../subtabs/ChangelogSubtab.vue';
import { getSubtabs, getComputedTab } from '@/stores/main/compUtils';
const store = useStore();
const TABS_LIST = {
  settings: SettingsSubtab,
  about: AboutSubtab,
  changelog: ChangelogSubtab,
};
const innerTab = computed(() =>
  getComputedTab(store.innerTabs.options as keyof typeof TABS_LIST, TABS_LIST)
);
const tabs = getSubtabs('options');
</script>
