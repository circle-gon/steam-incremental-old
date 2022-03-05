<template>
  <div class="notificationarea">
    <div
      v-for="(notify, i) in notifications"
      :key="notify.time"
      class="notification"
      @click="removeNotify(i)"
    >
      {{ notify.text }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from "@/stores/main";
import { computed } from "vue";
const store = useStore();
const notifications = computed(() => store.notifications.slice().reverse());
const removeNotify = (i: number) => {
  store.removeNotify(i);
};
</script>
<style scoped>
.notificationarea {
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 1;
}
.notification {
  position: relative;
  right: 0px;
  margin: 0px;
  padding: 2px;
  background-color: #000000;
  color: #ffffff;
  text-align: center;
  border-radius: 6px;
  z-index: 1;
}
</style>
