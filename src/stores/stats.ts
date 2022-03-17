import { defineStore } from "pinia";
import { ACHIEVEMENTS } from "./main/tabs";

function getIdFromData(row: number, col: number) {
  return row.toString() + col.toString();
}
export const useStatsStore = defineStore("stats", {
  state: () => ({
    totalTimePlayed: 0,
    // may replace with store
    achievesUnlocked: [] as string[],
  }),
  getters: {
    knowPoints() {
      let points = 0;
      for (const id of this.achievesUnlocked) {
        const matches = id.split("");
        const first = parseInt(matches[0]);
        const second = parseInt(matches[1]);
        points += ACHIEVEMENTS[first][second].bonus;
      }
      return points;
    },
    hasAchieve(store) {
      return (row: number, col: number) => {
        return store.achievesUnlocked.includes(getIdFromData(row, col));
      };
    },
  },
  actions: {
    updateAchieves() {
      for (const [rowNum, achieveRow] of ACHIEVEMENTS.entries()) {
        for (const [aNum, achieve] of achieveRow.entries()) {
          const token = getIdFromData(rowNum, aNum);
          if (achieve.isUnlocked() && !this.hasAchieve(rowNum, aNum)) {
            this.achievesUnlocked.push(token);
          }
        }
      }
    },
  },
});
