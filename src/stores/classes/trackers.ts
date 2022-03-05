// a stat tracker for tracking resources and
// their values
// does require resources list to equal obj[res]
// ie. "steam" -> obj.steam
import { ACHIEVEMENTS } from "../main/tabs";
import type {
  TrackType,
  ContentType,
  StatTrackerType,
  AchievementTrackerType,
} from "../main/types";
class StatTracker implements StatTrackerType {
  resList: string[];
  resources: TrackType;
  constructor(resources: string[]) {
    this.resList = resources;
    this.resources = {};
    for (const res of resources) {
      this.resources[res] = { totalMade: 0, currentAmt: 0 };
    }
  }

  update(content: ContentType) {
    for (const res of this.resList) {
      const owned = content[res].owned;
      const currentAmt = this.resources[res].currentAmt;
      if (owned > currentAmt) {
        this.resources[res].totalMade += owned - currentAmt;
      }
      this.resources[res].currentAmt = owned;
    }
  }
}
class AchievementTracker implements AchievementTrackerType {
  achievesUnlocked: number[];
  knowPoints: number;
  constructor() {
    this.achievesUnlocked = [];
    this.knowPoints = 0;
  }

  updateAchieves() {
    for (const [rowNum, achieveRow] of ACHIEVEMENTS.entries()) {
      for (const [aNum, achieve] of achieveRow.entries()) {
        const token = AchievementTracker.getIdFromData(rowNum, aNum);
        if (achieve.isUnlocked() && !this.hasAchieve(rowNum, aNum)) {
          this.achievesUnlocked.push(token);
          this.knowPoints += achieve.bonus;
        }
      }
    }
  }
  static getIdFromData(row: number, col: number) {
    return Number.parseInt(row.toString() + col.toString());
  }
  hasAchieve(row: number, col: number) {
    return this.achievesUnlocked.includes(
      AchievementTracker.getIdFromData(row, col)
    );
  }
}
export { AchievementTracker, StatTracker };
