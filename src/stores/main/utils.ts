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
  let remain;
  const timesList = ["seconds", "minutes", "hours", "days"];
  const text = [];
  const milliLeft = data % 1000;
  data = (data - milliLeft) / 1000;
  remain = data % 60;
  data = (data - remain) / 60;
  text.push((remain + milliLeft / 1000).toFixed(2) + " seconds");
  if (data >= 60) {
    remain = data % 60;
    data = (data - remain) / 60;
    text.push(remain + " minutes");
  }
  if (data >= 60 && text.length === 2) {
    remain = data % 60;
    data = (data - remain) / 60;
    text.push(remain + " hours");
  }
  if (data !== 0) {
    text.push(data + " " + timesList[text.length]);
  }
  const extraText = text.length > 1 ? ", and " : "";
  return (
    text
      .reverse()
      .slice(0, text.length - 1)
      .join(", ") +
    extraText +
    text[text.length - 1]
  );
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
