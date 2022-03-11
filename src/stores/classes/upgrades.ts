// upgrades n stuff for most of the game
import { R } from '../main/utils';
import { useStore } from '../main';
import { useSteamStore } from '../steam';
import type {
  ConfigType,
  UpgradeType,
  OneTimeUpgradeType,
  OneTimeConfigType,
  UpgradeDataType,
  CoreConfigType,
} from '../main/types';

const basicConfig: CoreConfigType = { layer: Infinity, data: { show: false } };
class Upgrades implements UpgradeType {
  name: string;
  desc: string;
  getPrice: (level: number) => number;
  getEffect: (level: number) => number;
  isUnlocked: () => boolean;
  layer: number;
  level: number;
  maxLevel: number;
  data: UpgradeDataType;
  constructor(
    name: string,
    desc: string,
    getPrice: (level: number) => number,
    getEffect: (level: number) => number,
    isUnlocked: () => boolean,
    config: ConfigType = basicConfig
  ) {
    this.name = name;
    this.desc = desc;
    this.level = 0;
    this.getPrice = getPrice;
    this.getEffect = getEffect;
    this.isUnlocked = isUnlocked;
    this.layer = config.layer;
    this.data = config.data;
    this.maxLevel = R(config.maxLevel, Infinity);
  }

  getCurrentPrice() {
    return this.getPrice(this.level);
  }

  getPriceDisplay() {
    return this.getCurrentPrice() + ' ' + this.getResource();
  }

  isMaxLevel() {
    return this.level === this.maxLevel;
  }

  hasBought() {
    return this.level > 0;
  }

  getStore() {
    let curr: { owned: number } = { owned: 0 };
    switch (this.layer) {
      case 1:
        curr = useSteamStore().steam;
      default:
        break;
    }
    return curr;
  }

  getResource() {
    const res = 'steam';
    switch (this.layer) {
      default:
        break;
    }
    return res;
  }

  isUnbuyable() {
    const res = this.getStore();
    if (this.isMaxLevel()) return true;
    return res.owned < this.getCurrentPrice();
  }

  buy() {
    const store = this.getStore();
    const price = this.getCurrentPrice();
    if (price <= this.getStore().owned && !this.isMaxLevel()) {
      switch (this.layer) {
        case 1:
          store.owned -= price;
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
    config: OneTimeConfigType = basicConfig
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
