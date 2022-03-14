<template>
  <div>
    <textarea
      v-model="save"
      rows="4"
      cols="150"
      style="width: 100%"
      placeholder="This is your exported save. Keep it safe in case your save gets lost!"
    /><br />
    <table class="center">
      <!-- :key="i": unsafe key -->
      <tr v-for="(btnRow, i) in btns" :key="i">
        <!-- :key="s": unsafe key -->
        <td v-for="(innerRow, s) in btnRow" :key="s">
          <div v-if="innerRow === undefined"></div>
          <setting-input-button
            v-else-if="innerRow.type === 'input'"
            :data="innerRow"
          />
          <setting-button
            v-else-if="innerRow.type === 'button'"
            :data="innerRow"
          />
        </td>
      </tr>
    </table>
  </div>
</template>
<script setup lang="ts">
// @unsafe key
import SettingButton from '../generic/SettingButton.vue';
import SettingInputButton from '../generic/SettingButtonInput.vue';
import { getTab } from '@/stores/main/compUtils';
import { computed } from 'vue';
import { useStore } from '@/stores/main';
const store = useStore();
const btns = getTab('options').buttons;
const save = computed({
  get: () => store.internals.save,
  set: (save: string) => {
    store.internals.save = save;
  },
});
</script>
