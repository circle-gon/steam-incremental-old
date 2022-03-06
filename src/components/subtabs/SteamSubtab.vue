<template>
  <div>
    <div>You have {{ displayNumber(steam.water.owned) }} water.</div>
    <button
      :class="{ useable: isUseable('fill') }"
      @click="getResource('fill')"
    >
      Fill the furnace
    </button>
    <button
      :class="{ useable: isUseable('heat') }"
      @click="getResource('heat')"
    >
      Heat the furnace
    </button>
    <button
      :class="{ useable: isUseable('water') }"
      @click="getResource('water')"
    >
      Get 1 Water
    </button>
    <div>
      Heat in furnace: {{ displayNumber(steam.heat.owned) }}/{{
        displayNumber(steam.heat.req)
      }}<br />
      Water in furnace: {{ displayNumber(steam.fill.owned) }}/{{
        displayNumber(steam.fill.req)
      }}
    </div>
    <!--<upgrade-button
      v-for="(upgrade, i) in steam.upgrades"
      :key="upgrade.name"
      :upgrade="upgrade"
      :upg-id="i"
      :one-time="false"
    />-->
    <div>Upgrades:</div>
    <upgrade-button
      v-for="(upgrade, i) in steam.oneUpgrades"
      :key="upgrade.name"
      :upgrade="upgrade"
      :upg-id="i"
      :one-time="true"
    />
  </div>
</template>
<script setup lang="ts">
import { useStore } from "@/stores/main";
import { computed } from "vue";
import UpgradeButton from "../generic/UpgradeButton.vue";
import { displayNumber } from "@/stores/main/utils";
import type { SteamResourceType } from "@/stores/main/types";
const store = useStore();
const steam = computed(() => store.steam);
const isUseable = (otherRes: SteamResourceType) =>
  store.isUseable("steam", otherRes);
const getResource = (res: SteamResourceType) => {
  store.steam.getResource(res);
};
</script>
