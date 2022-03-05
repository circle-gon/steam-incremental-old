<template>
  <div class="options style-as-button">
    {{ data.display() }}<br />
    <input
      v-model="result"
      type="range"
      :min="data.other.min"
      :max="data.other.max"
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import type { SettingButtonInputType } from "@/stores/main/types";
const props = defineProps<{
  data: SettingButtonInputType;
}>();
const result = computed({
  get: () => props.data.other.getValue(),
  set(value: number) {
    props.data.doInput(props.data.other.result(value));
  },
});
</script>
<style scoped>
.options {
  height: 50px;
  width: 160px;
}
</style>
