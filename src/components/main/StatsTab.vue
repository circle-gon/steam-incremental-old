<template>
  <div class="tab-display">
    You have made a total of
    {{ tracked.steam.totalMade }} steam.<br />
    You have been playing for
    {{ prettyTimeAsTotal(store.stats.totalTimePlayed) }}.
  </div>
</template>
<script setup lang="ts">
import { useStore } from "@/stores/main";
import { prettyTimeAsTotal } from "@/stores/main/utils";
const store = useStore();
const tracked = store.steam.statTracker.resources;
</script>
