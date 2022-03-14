import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useStore } from './stores/main';
import App from './App.vue';

createApp(App).use(createPinia()).mount('#app');
window.addEventListener('keydown', (e) => {
  const store = useStore();
  if (!store.keypresses.has(e.key)) {
    store.keypresses.add(e.key);
  }
});
window.addEventListener('keyup', (e) => {
  const store = useStore();
  store.keypresses.delete(e.key);
});
window.addEventListener('visibilitychange', () => {
  const store = useStore();
  store.keypresses.clear();
});
