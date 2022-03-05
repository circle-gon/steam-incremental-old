import type { AchievementType } from "../main/types";

class Achievement implements AchievementType {
  desc: string;
  hoverText: string;
  img: string;
  isUnlocked: () => boolean;
  bonus: number;
  constructor(
    desc: string,
    hoverText: string,
    img: string,
    isUnlocked: () => boolean,
    bonus: number
  ) {
    this.desc = desc;
    this.hoverText = hoverText.replace(
      "[kPoints]",
      bonus + " knowledge points"
    );
    this.img = img;
    this.isUnlocked = isUnlocked;
    this.bonus = bonus;
  }
}
export { Achievement };
