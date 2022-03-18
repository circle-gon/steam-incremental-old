import type {
  GenericObjectType,
  GenericObjectTypeType,
  BasicType,
} from "./types";
import { isInputTypeArray, isInputTypeObject, isInputType } from "./typeUtils";
// number display
const displayNumber = function (what: number, prec = 2, overide = false) {
  // if number is interger, display it as whole
  if (Number.isInteger(what)) {
    return what.toString();
  } else if (what < 1e9) {
    if (what > 1e3) {
      return what.toLocaleString("en-US");
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
  if (showFullClass && typeof obj === "object") {
    return Object.prototype.toString.call(obj);
  }
  if (obj == null) {
    return (obj + "").toLowerCase();
  } // implicit toString() conversion
  const deepType = Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase();
  if (deepType === "generatorfunction") {
    return "function";
  }

  // Prevent overspecificity (for example, [object HTMLDivElement], etc).
  // Account for functionish Regexp (Android <=2.3), functionish <object> element (Chrome <=57, Firefox <=52), etc.
  // String.prototype.match is universally supported.

  return deepType.match(
    /^(array|bigint|date|error|function|generator|regexp|symbol)$/
  )
    ? deepType
    : typeof obj === "object" || typeof obj === "function"
    ? "object"
    : typeof obj;
};
const deepReplace = function (
  obj: GenericObjectTypeType,
  data: GenericObjectTypeType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  modifier = (obj: BasicType, data: BasicType, key: string | number) => false
) {
  if (isInputTypeArray(obj) && isInputTypeArray(data)) {
    for (const key of obj.keys()) {
      const val = obj[key];
      const otherData = data[key];
      if (modifier(val, otherData, key)) continue;
      if (isInputType(val) && isInputType(otherData)) {
        deepReplace(val, otherData, modifier);
      } else {
        data[key] = val;
      }
    }
  } else if (isInputTypeObject(obj) && isInputTypeObject(data)) {
    //console.log(obj)
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const otherData = data[key];
      if (modifier(val, otherData, key)) continue;
      if (isInputType(val) && isInputType(otherData)) {
        deepReplace(val, otherData, modifier);
      } else {
        data[key] = val;
      }
    }
  } else {
    throw new TypeError(
      `Invalid type of input: input obj is type ${getFullType(
        obj,
        false
      )}, while input data is ${getFullType(obj, false)}`
    );
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
