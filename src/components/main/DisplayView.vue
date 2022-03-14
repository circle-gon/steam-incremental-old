<template>
  <div class="business-display">
    <span>
      <span v-if="shown"> FPS: {{ displayNumber(actFPS, 0, true) }} </span>
      <span v-else class="hide"> FPS: 60 </span>
    </span>
    <span> You currently have {{ steam.owned }} steam. </span>
    <span class="hide"> FPS: 60 </span>
  </div>
</template>
<script setup lang="ts">
import { useStore, useSteamStore } from "@/stores/main";
import { displayNumber } from "@/stores/main/utils";
import { computed } from "vue";
const steamStore = useSteamStore();
const store = useStore();
const steam = computed(() => steamStore.steam);
const actFPS = computed(() => store.internals.fps);
const shown = computed(() => store.settings.displayFPS);
</script>
<style scoped>
.business-display {
  display: flex;
  justify-content: space-between;
}
</style>
