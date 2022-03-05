<template>
  <div class="center">
    <tabs-view :tab-list="tabs" :main-tab="true" />
  </div>
</template>
<script setup lang="ts">
import TabsView from '../generic/TabsView.vue';
import { TABS as tabs } from '@/stores/main/tabs';
</script>
