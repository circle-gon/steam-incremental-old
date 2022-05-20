<template>
  <div>
    <div>You have {{ displayNumber(store.water.owned) }} water.</div>
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
      Heat in furnace: {{ displayNumber(store.heat.owned) }}/{{
        displayNumber(store.heat.queueData.req)
      }}<br />
      Water in furnace: {{ displayNumber(store.fill.owned) }}/{{
        displayNumber(store.fill.queueData.req)
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
    <div class="flex">
      <upgrade-button
        v-for="(upgrade, i) in store.oneUpgrades"
        :key="upgrade.name"
        :upgrade="upgrade"
        :upg-id="i"
        :one-time="true"
        :current-data="upgrade.data"
        ><div v-if="i === 'auto' && upgrade.data.show">
          Enable: <input v-model="store.autoFurnace" type="checkbox" />
          <br />Currently: {{ upgrade.data.getBonus() }}
        </div></upgrade-button
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { useSteamStore } from "@/stores/main";
import UpgradeButton from "../generic/UpgradeButton.vue";
import { displayNumber } from "@/stores/main/utils";
import type { SteamResourceType } from "@/stores/main/types";
const store = useSteamStore();
const isUseable = (otherRes: SteamResourceType) => store.isUseable(otherRes);
const getResource = (res: SteamResourceType) => {
  store.getResource(res);
};
</script>
