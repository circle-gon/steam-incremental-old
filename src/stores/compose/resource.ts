import { R, getTime } from '../main/utils';
import type {
  ResourceInputType,
  QueueType,
  QueueDataType,
} from '../main/types';
import { isOfType } from '../main/typeUtils';
import { upThenDown as defaultQueue } from '../main/queue-gpt';
import { ref, reactive } from 'vue';
import type { UnwrapNestedRefs } from 'vue';

function Resource(obj: ResourceInputType = {}) {
  const owned = ref(R(obj.owned, 0));
  const multi = ref(R(obj.multi, 1));
  let queueData: undefined | UnwrapNestedRefs<QueueDataType> = undefined;
  if (obj.req !== undefined) {
    queueData = reactive({
      req: obj.req,
      k: 1,
      c: 5,
      queue: [],
      gainPerTick:
        obj.gainPerTick !== undefined ? obj.gainPerTick : defaultQueue,
      sideEffect:
        obj.sideEffect !== undefined
          ? obj.sideEffect
          : () => {
              return undefined;
            },
      canDo: obj.canDo !== undefined ? obj.canDo : () => true,
    });
  }
  const isNotFull = function () {
    if (queueData) {
      return owned.value < queueData.req;
    }
    console.warn('Running isNotFull on object that does not have queueData');
    return undefined;
  };
  function isEmpty(notFull = true) {
    if (queueData) {
      return (
        (notFull ? isNotFull() : true) &&
        !queueData.queue.some((element) => {
          return element.manual === true;
        })
      );
    }
    console.warn('Running isEmpty on object that does not have queueData');
    return undefined;
  }
  function addNewQueue(drainAmt: number, manual = true) {
    if (queueData) {
      queueData.queue.push({
        remain: drainAmt,
        onStart: drainAmt,
        time: getTime(),
        drainFactor: queueData.k,
        c: queueData.c,
        lastRemain: 0,
        manual: manual,
      });
    }
  }

  function update() {
    if (queueData) {
      for (const [num, data] of queueData.queue.entries()) {
        if (isOfType<QueueType>(data, 'c') && queueData.canDo()) {
          data.lastRemain = data.remain;
          data.remain = queueData.gainPerTick(data);
          // (c+1)/c because of start errors
          // now todo: figure out c and k's effect on result
          const diff = data.lastRemain - data.remain;
          owned.value += diff;
          queueData.sideEffect(diff);
          if (owned.value > queueData.req) {
            queueData.queue = [];
            owned.value = queueData.req;
          } else if (data.remain < 0.01) {
            owned.value += data.remain;
            queueData.sideEffect(data.remain);
            queueData.queue.splice(num, 1);
          }
        }
      }
    }
  }

  return {
    // properties
    owned,
    multi,
    queueData,
    // computed
    isNotFull,
    // functions
    addNewQueue,
    isEmpty,
    update,
  };
}
export { Resource };
