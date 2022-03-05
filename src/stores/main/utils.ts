import type { GenericObjectType } from './types';
// number display
const displayNumber = function (what: number, prec = 2, overide = false) {
  // if number is interger, display it as whole
  if (Number.isInteger(what)) {
    return what.toString();
  } else if (what < 1e9) {
    if (Number.isInteger(what * 10) && !overide) {
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
  const timesList = ['seconds', 'minutes', 'hours', 'days'];
  const text = [];
  const milliLeft = data % 1000;
  data = (data - milliLeft) / 1000;
  remain = data % 60;
  data = (data - remain) / 60;
  text.push((remain + milliLeft / 1000).toFixed(2) + ' seconds');
  if (data >= 60) {
    remain = data % 60;
    data = (data - remain) / 60;
    text.push(remain + ' minutes');
  }
  if (data >= 60 && text.length === 2) {
    remain = data % 60;
    data = (data - remain) / 60;
    text.push(remain + ' hours');
  }
  if (data !== 0) {
    text.push(data + ' ' + timesList[text.length]);
  }
  const extraText = text.length > 1 ? ', and ' : '';
  return (
    text
      .reverse()
      .slice(0, text.length - 1)
      .join(', ') +
    extraText +
    text[text.length - 1]
  );
};
// util functions
const getTime = function () {
  return Date.now();
};
const isUndef = function <T>(item: T | undefined) {
  return item === undefined;
};
const R = function <Type, OtherType>(
  item: Type | undefined,
  replacer: OtherType
) {
  return item !== undefined ? item : replacer;
};
const copy = function (v: GenericObjectType, keys: string[], isInclude = true) {
  const r: GenericObjectType = {};
  for (const k in v) {
    if (
      Object.prototype.hasOwnProperty.call(v, k) &&
      (isInclude ? keys.includes(k) : !keys.includes(k))
    ) {
      r[k] = v[k];
    }
  }
  return r;
};
export { displayNumber, prettyTimeAsTotal, getTime, isUndef, R, copy };
