<template>
  <div class="tab-display">
    <br />
    <br />
    You have {{ points }} knowledge points, which multiply motivation's effect
    by {{ points + 1 }}.
    <table class="center">
      <!-- :key="rowId": unsafe key -->
      <tr v-for="(achieveRow, rowId) in achieves" :key="rowId">
        <!-- :key="aId": unsafe key -->
        <td
          v-for="(achieve, aId) in achieveRow"
          :key="aId"
          class="style-as-button achieve tooltip"
          :style="{ 'background-color': isUnlocked(rowId, aId) }"
        >
          <span>{{ achieve.desc }}</span>
          <span class="tooltiptext">{{ achieve.hoverText }}</span>
        </td>
      </tr>
    </table>
  </div>
</template>
<script setup lang="ts">
// @unsafe key
import { ACHIEVEMENTS } from "@/stores/main/tabs";
import { useStore } from "@/stores/main";
import { computed } from "vue";
const store = useStore();
const achieves = ACHIEVEMENTS;
const points = computed(() => store.stats.achievements.knowPoints);
const isUnlocked = (rowId: number, colId: number) => {
  return store.stats.achievements.hasAchieve(rowId, colId)
    ? "#00FF00"
    : "#FFFFFF";
};
</script>
<style scoped>
.achieve {
  vertical-align: top;
  text-align: center;
  font-size: 0.875rem;
  width: 128px;
  height: 128px;
  padding: 4px;
  border: solid;
  border-width: 1px 1px;
}
</style>
