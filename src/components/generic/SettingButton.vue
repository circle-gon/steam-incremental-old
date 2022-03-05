<template>
  <button class="options" @click="data.do()">
    {{ data.display() }}
  </button>
</template>
<script setup lang="ts">
import type { SettingButtonType } from '@/stores/main/types';
defineProps<{
  data: SettingButtonType;
}>();
</script>
<style scoped>
.options {
  height: 50px;
  width: 160px;
}
</style>
