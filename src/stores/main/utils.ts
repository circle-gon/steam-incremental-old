import type { GenericObjectType } from './types';
// number display
const displayNumber = function (what: number, prec = 2, overide = false) {
  // if number is interger, display it as whole
  if (Number.isInteger(what)) {
    return what.toString();
  } else if (what < 1e9) {
    if (what > 1e3) {
      return what.toLocaleString('en-US');
    } else if (Number.isInteger(what * 10) && !overide) {
      return what.toFixed(1);
    } else {
      return what.toFixed(prec);
    }
  } else {
    return what.toExponential(prec);
  }
};

// time utils
const getTime = function () {
  return Date.now();
};
function getTimePassed(time: number) {
  return (getTime() - time) / 1000;
}

// time formatting
const prettyTimeAsTotal = function (data: number) {
  const hours = Math.floor(data / 1000 / 60 / 60);
  const minutes = Math.floor(data / 1000 / 60 - hours * 60);
  const seconds = parseFloat(
    (data / 1000 - hours * 3600 - minutes * 60).toFixed(2)
  );
  function format(time: number, name: string, comma = true) {
    return time > 0
      ? time + ' ' + name + (time > 1 ? 's' : '') + (comma ? ',' : '')
      : '';
  }
  return [
    format(hours, 'hour'),
    format(minutes, 'minute'),
    format(seconds, 'second', false),
  ].join(' ');
};
// util functions
const R = function <Type, OtherType>(
  item: Type | undefined,
  replacer: OtherType
) {
  return item !== undefined ? item : replacer;
};
const deepReplace = function mergeDeep<T extends Q, Q extends object>(
  target: T,
  source: Q,
  modifier: <T extends Q, Q extends object>(
    target: T,
    source: Q,
    key: keyof Q
  ) => boolean = () => false
): void {
  for (const key in source) {
    if (!Object.hasOwn(source, key)) continue;
    if (modifier(target, source, key)) continue;
    const val = source[key];
    if (typeof val === 'object') {
      mergeDeep(target[key], val, modifier);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }
};
const copy = function (v: GenericObjectType, keys: string[], isInclude = true) {
  const r: GenericObjectType = {};
  for (const k in v) {
    if (
      Object.hasOwn(v, k) &&
      (isInclude ? keys.includes(k) : !keys.includes(k))
    ) {
      r[k] = v[k];
    }
  }
  return r;
};
// prevent ts-prune from erroring the functions below
export {
  // ts-prune-ignore-next
  displayNumber,
  // ts-prune-ignore-next
  prettyTimeAsTotal,
  getTime,
  R,
  copy,
  getTimePassed,
  deepReplace,
};
