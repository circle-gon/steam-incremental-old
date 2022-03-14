// a stat tracker for tracking resources and
// their values
// does require resources list to equal obj[res]
// ie. "steam" -> obj.steam
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
export { StatTracker };
