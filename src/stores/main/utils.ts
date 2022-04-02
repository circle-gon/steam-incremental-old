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
// time formatting
const prettyTimeAsTotal = function (data: number) {
  const hours = Math.floor(data / 1000 / 60 / 60);
  const minutes = Math.floor(data / 1000 / 60 - hours * 60);
  const seconds = (data / 1000 - hours * 3600 - minutes * 60).toFixed(2);
  return `Hours: ${hours}, minutes: ${minutes}, seconds: ${seconds}`;
};
// util functions
const getTime = function () {
  return Date.now();
};
function getTimePassed(time: number) {
  return (getTime() - time) / 1000;
}
const isUndef = function <T>(item: T | undefined) {
  return item === undefined;
};
const R = function <Type, OtherType>(
  item: Type | undefined,
  replacer: OtherType
) {
  return item !== undefined ? item : replacer;
};
const getFullType = function (obj: unknown, showFullClass: boolean) {
  // get toPrototypeString() of obj (handles all types)
  if (showFullClass && typeof obj === 'object') {
    return Object.prototype.toString.call(obj);
  }
  if (obj == null) {
    return (obj + '').toLowerCase();
  } // implicit toString() conversion
  const deepType = Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase();
  if (deepType === 'generatorfunction') {
    return 'function';
  }

  // Prevent overspecificity (for example, [object HTMLDivElement], etc).
  // Account for functionish Regexp (Android <=2.3), functionish <object> element (Chrome <=57, Firefox <=52), etc.
  // String.prototype.match is universally supported.

  return deepType.match(
    /^(array|bigint|date|error|function|generator|regexp|symbol)$/
  )
    ? deepType
    : typeof obj === 'object' || typeof obj === 'function'
    ? 'object'
    : typeof obj;
};
export function isObject(obj: unknown): obj is object {
  return obj !== null && typeof obj === 'object';
}
const deepReplace = function mergeDeep<T extends Q, Q extends object>(
  target: T,
  source: Q,
  modifier: (target: unknown, source: unknown, key: string) => boolean = () =>
    false
): T {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (!Object.hasOwn(source, key)) continue;
      if (modifier(target, source, key)) continue;
      //debugger;
      const val = source[key];
      if (typeof val === 'object') {
        mergeDeep(target[key], val, modifier);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return target;
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
export {
  displayNumber,
  prettyTimeAsTotal,
  getTime,
  isUndef,
  R,
  copy,
  getTimePassed,
  getFullType,
  deepReplace,
};
