<template>
  <div class="tab-display">
    <span v-for="loreItem in lore" :key="loreItem.textRequire">
      <div v-if="loreItem.unlocked()">
        {{ loreItem.text }}
      </div>
    </span>
    <br />
    <br />
    <br />
    <div>Unlock next lore requirement: {{ getNextLore() }}</div>
  </div>
</template>
<script setup lang="ts">
import { getTab, getNextLore } from "@/stores/main/compUtils";
const lore = getTab("lore").lore;
</script>
