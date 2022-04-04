<template>
  <div class="tab-display">
    You have made a total of
    {{ displayNumber(tracked.steam.totalMade) }} steam.<br />
    You have been playing for
    {{ prettyTimeAsTotal(statsStore.totalTimePlayed) }}.
  </div>
</template>
<script setup lang="ts">
import { useStatsStore, useSteamStore } from '@/stores/main';
import { prettyTimeAsTotal, displayNumber } from '@/stores/main/utils';
const steamStore = useSteamStore();
const statsStore = useStatsStore();
const tracked = steamStore.statTracker.resources;
</script>
