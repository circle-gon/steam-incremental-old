import { createApp } from "vue";
import { createPinia } from "pinia";
import { useKeypressStore } from "./stores/main";
import App from "./App.vue";

createApp(App).use(createPinia()).mount("#app");
window.addEventListener("keydown", (e) => {
  const store = useKeypressStore();
  store.keydown(e);
});
window.addEventListener("keyup", (e) => {
  const store = useKeypressStore();
  store.keyup(e);
});
window.addEventListener("visibilitychange", () => {
  const store = useKeypressStore();
  store.clear();
});
