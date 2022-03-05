// upgrades n stuff for most of the game
import { R } from "../main/utils";
import { useStore } from "../main";
import type {
  ConfigType,
  UpgradeType,
  OneTimeUpgradeType,
  OneTimeConfigType,
} from "../main/types";
class Upgrades implements UpgradeType {
  name: string;
  desc: string;
  getPrice: (level: number) => number;
  getEffect: (level: number) => number;
  isUnlocked: () => boolean;
  layer: number;
  level: number;
  maxLevel: number;
  constructor(
    name: string,
    desc: string,
    getPrice: (level: number) => number,
    getEffect: (level: number) => number,
    isUnlocked: () => boolean,
    config: ConfigType = { layer: Infinity }
  ) {
    this.name = name;
    this.desc = desc;
    this.level = 0;
    this.getPrice = getPrice;
    this.getEffect = getEffect;
    this.isUnlocked = isUnlocked;
    this.layer = config.layer;
    this.maxLevel = R(config.maxLevel, Infinity);
  }

  getCurrentPrice() {
    return this.getPrice(this.level);
  }

  getPriceDisplay() {
    return this.getCurrentPrice() + " " + this.getResource();
  }

  isMaxLevel() {
    return this.level === this.maxLevel;
  }

  hasBought() {
    return this.level > 0;
  }

  getCurrency() {
    const store = useStore();
    const res = store.steam.steam;
    switch (this.layer) {
      case 1:
        break;
      default:
        break;
    }
    return res.owned;
  }

  getResource() {
    const res = "steam";
    switch (this.layer) {
      default:
        break;
    }
    return res;
  }

  isUnbuyable() {
    const res = this.getCurrency();
    if (this.isMaxLevel()) return true;
    return res < this.getCurrentPrice();
  }

  buy() {
    const store = useStore();
    const price = this.getCurrentPrice();
    if (price <= this.getCurrency() && !this.isMaxLevel()) {
      switch (this.layer) {
        case 1:
          store.steam.steam.owned -= price;
          break;
        default:
          break;
      }
      this.level++;
    }
  }

  static use(upg: UpgradeType) {
    return upg.getEffect(upg.level);
  }
}
class OneTimeUpgrades extends Upgrades implements OneTimeUpgradeType {
  getPrice: () => number;
  getEffect: () => number;
  constructor(
    name: string,
    desc: string,
    getPrice: number,
    getEffect: number,
    isUnlocked: () => boolean,
    config: OneTimeConfigType = { layer: Infinity }
  ) {
    super(
      name,
      desc,
      () => getPrice,
      () => getEffect,
      isUnlocked,
      config
    );
    this.getPrice = () => getPrice;
    this.getEffect = () => getEffect;
    this.maxLevel = 1;
  }
  getCurrentPrice() {
    return this.getPrice();
  }
  static use(upg: OneTimeUpgradeType) {
    return upg.isMaxLevel() ? upg.getEffect() : 0;
  }
}
export { OneTimeUpgrades, Upgrades };
