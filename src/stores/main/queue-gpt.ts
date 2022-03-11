import type { QueueType } from "./types";
import {getTimePassed } from "./utils";

function upThenDown(data: QueueType) {
  return (
    ((data.onStart * (data.c + 1)) / data.c) *
    (1 -
      1 /
        (1 + data.c * Math.E ** (-data.drainFactor * getTimePassed(data.time))))
  );
}

function linear(data: QueueType) {
  return (
    data.onStart *
    (1 - (getTimePassed(data.time)) / 1)
  );
}

export { linear, upThenDown };
