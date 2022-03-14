import {defineStore} from 'pinia'

export const useKeypressStore = defineStore("keypress", {
  state: () => ({
    keypresses: new Set<string>()
  }),
  actions: { 
    keydown(e: KeyboardEvent) {
      if (!this.keypresses.has(e.key)) {
        this.keypresses.add(e.key);
      }
    },
  
    keyup(e: KeyboardEvent) {
      this.keypresses.delete(e.key);
    },
  
    clear() {
      this.keypresses.clear();
    }
  }
})