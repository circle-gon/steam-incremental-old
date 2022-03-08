import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useStore } from './stores/main';
import App from './App.vue';

createApp(App).use(createPinia()).mount('#app');
window.addEventListener('keydown', (e) => {
  const store = useStore();
  store.keypresses.keydown(e);
});
window.addEventListener('keyup', (e) => {
  const store = useStore();
  store.keypresses.keyup(e);
});
window.addEventListener('visibilitychange', () => {
  const store = useStore();
  store.keypresses.clear();
});
