import { defineStore } from 'pinia';
import type { NotificationType } from './main/types';

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as NotificationType[],
  }),
  actions: {
    updateNotifications() {
      for (const [num, notify] of this.notifications.entries()) {
        if (Date.now() - notify.time > 5000) {
          this.removeNotify(num);
        }
      }
    },
    notify(text: string) {
      this.notifications.push({
        text: text,
        time: Date.now(),
      });
    },
    removeNotify(id: number) {
      this.notifications.splice(id, 1);
    },
  },
});
