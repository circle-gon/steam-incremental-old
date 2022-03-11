<template>
  <span v-if="upgrade.isUnlocked()">
    <button
      :class="{ useable: !upgrade.isUnbuyable(), maxed: upgrade.isMaxLevel() }"
      :disabled="upgrade.isUnbuyable()"
      @click="buyUpgrade(upgData)"
    >
      {{ upgrade.name }}
      <br />{{ upgrade.desc }} <br />Cost: {{ upgrade.getPriceDisplay() }}
      <div v-if="currentData.show">
      Currently: {{currentData.getBonus()}}
      </div>
    </button>
  </span>
</template>
<script setup lang="ts">
import { useStore } from '@/stores/main';
import { computed } from 'vue';
import type { UpgradeType, OneTimeUpgradeType, UpgradeDataType } from '@/stores/main/types';
const store = useStore();
const props = defineProps<{
  upgId: string | number;
  upgrade: UpgradeType | OneTimeUpgradeType;
  oneTime: boolean;
  currentData: UpgradeDataType
}>();
const buyUpgrade = (obj: { name: string; layer: number; oneTime: boolean }) => {
  store.buyUpgrade(obj);
};
const upgData = computed(() => {
  return {
    name: props.upgId as string,
    layer: props.upgrade.layer,
    oneTime: props.oneTime,
  };
});
</script>
<style scoped>
.maxed {
  background: #1fad1f;
}
</style>
