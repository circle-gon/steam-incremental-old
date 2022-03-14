<template>
  <div v-if="modal" class="modal" @click="closeModalHandler">
    <!-- Modal content -->
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <component :is="modal" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from "@/stores/main";
import { computed } from "vue";
//import { getComputedTab } from '../../stores/main/compUtils';
const store = useStore();
const modal = computed((): null | object => {
  if (store.modal !== "") {
    throw new Error("modals do not exist");
    //return getComputedTab(store.modal, {});
  }
  return null;
});
const closeModal = function () {
  store.modal = "";
};
const closeModalHandler = function (e: MouseEvent) {
  if ((e.target as Element).className === "modal") {
    closeModal();
  }
};
</script>
<style scoped>
.modal {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}
.close {
  position: absolute;
  top: 0;
  right: 10px;
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
