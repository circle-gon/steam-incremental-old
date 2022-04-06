import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { Resource } from './classes/resource';
import type { ResourceQueueType } from './main/types';

export const useSteamStore = defineStore('steam', () => {
  const steam = reactive(new Resource());
  const water = reactive(
    new Resource({
      owned: 10,
      req: 1e100,
    }) as ResourceQueueType
  );
  return { steam, water };
});
