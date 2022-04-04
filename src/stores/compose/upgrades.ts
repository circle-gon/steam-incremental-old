import { R } from '../main/utils';
import { useSteamStore } from '../main';
import type {
  ConfigType,
  UpgradeType,
  OneTimeUpgradeType,
  OneTimeConfigType,
} from '../main/types';
import { ref } from 'vue';
import type { Ref, UnwrapNestedRefs } from 'vue';
const basicConfig: OneTimeConfigType & ConfigType = {
  layer: Infinity,
  data: { show: false },
};
function Upgrades(
  _name: string,
  _desc: string,
  getPrice: (level: Ref<number>) => number,
  getEffect: (level: Ref<number>) => number,
  isUnlocked: () => boolean,
  _config: ConfigType = basicConfig
) {
  const name = ref(_name);
  const desc = ref(_desc);
  const level = ref(0);
  const layer = ref(_config.layer);
  const data = ref(_config.data);
  const maxLevel = ref(R(_config.maxLevel, Infinity));
  function getResource() {
    const res = 'steam';
    switch (layer.value) {
      default:
        break;
    }
    return res;
  }
  function getCurrentPrice() {
    return getPrice(level);
  }

  function getPriceDisplay() {
    return getCurrentPrice() + ' ' + getResource();
  }

  function isMaxLevel() {
    return level.value >= maxLevel.value;
  }

  function hasBought() {
    return level.value > 0;
  }

  function getStore() {
    let curr: { owned: number } = { owned: 0 };
    switch (layer.value) {
      case 1:
        curr = useSteamStore().steam;
        break;
      default:
        break;
    }
    return curr;
  }
  function isUnbuyable() {
    const res = getStore();
    if (isMaxLevel()) return true;
    return res.owned < getCurrentPrice();
  }

  function buy() {
    const store = getStore();
    const price = getCurrentPrice();
    if (price <= getStore().owned && !isMaxLevel()) {
      store.owned -= price;
      level.value++;
    }
  }
  return {
    name, //
    desc, //
    level,
    layer, //
    data,
    getPrice,
    getEffect,
    isUnlocked,
    maxLevel,
    getResource,
    getCurrentPrice,
    getPriceDisplay,
    isMaxLevel, //
    hasBought,
    getStore,
    isUnbuyable, //
    buy,
  };
}
Upgrades.use = function (upg: UnwrapNestedRefs<UpgradeType>) {
  return upg.getEffect(ref(upg.level));
};

function OneTimeUpgrades(
  name: string,
  desc: string,
  getPrice: number,
  getEffect: number,
  isUnlocked: () => boolean,
  config: OneTimeConfigType = basicConfig
) {
  const __upgInstance__ = Upgrades(
    name,
    desc,
    () => getPrice,
    () => getEffect,
    isUnlocked,
    config
  );
  __upgInstance__.getPrice = () => getPrice;
  __upgInstance__.getEffect = () => getEffect;
  __upgInstance__.maxLevel.value = 1;
  return {
    name: __upgInstance__.name,
    desc: __upgInstance__.desc,
    level: __upgInstance__.level,
    layer: __upgInstance__.layer,
    data: __upgInstance__.data,
    getPrice: () => getPrice,
    getEffect: () => getEffect,
    isUnlocked: __upgInstance__.isUnlocked,
    maxLevel: __upgInstance__.maxLevel,
    getResource: __upgInstance__.getResource,
    getCurrentPrice: __upgInstance__.getCurrentPrice,
    getPriceDisplay: __upgInstance__.getPriceDisplay,
    isMaxLevel: __upgInstance__.isMaxLevel,
    hasBought: __upgInstance__.hasBought,
    getStore: __upgInstance__.getStore,
    isUnbuyable: __upgInstance__.isUnbuyable,
    buy: __upgInstance__.buy,
  };
}
OneTimeUpgrades.use = function (upg: UnwrapNestedRefs<OneTimeUpgradeType>) {
  return upg.isMaxLevel() ? upg.getEffect() : 0;
};
export { Upgrades, OneTimeUpgrades };
