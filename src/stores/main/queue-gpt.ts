import type { QueueType } from './types';
import { getTime } from './utils';

function getTimePassed(time: number) {
  return (getTime() - time) / 1000;
}
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
    (1 - (getTimePassed(data.time) * data.drainFactor) / data.c ** 1.05)
  );
}

export { linear, upThenDown };
