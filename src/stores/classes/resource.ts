import { R, getTime } from '../main/utils';
import type {
  ResourceInputType,
  QueueType,
  ResourceType,
  GainType,
} from '../main/types';
import { isOfType } from '../main/types';
import { upThenDown as defaultQueue } from '../main/queue-gpt';
class Resource implements ResourceType {
  owned: number;
  multi: number;
  queueData?: {
    req: number;
    k: number;
    c: number;
    queue: QueueType[];
    gainPerTick: GainType;
    sideEffect: (diff: number) => void;
    canDo: () => boolean;
  };
  constructor(obj: ResourceInputType = {}) {
    this.owned = R(obj.owned, 0);
    this.multi = R(obj.multi, 1);
    // req to max
    // left to drain
    if (obj.req !== undefined) {
      this.queueData = {
        req: obj.req,
        k: 1,
        c: 5,
        queue: [],
        gainPerTick:
          obj.gainPerTick !== undefined ? obj.gainPerTick : defaultQueue,
        sideEffect: obj.sideEffect !== undefined ? obj.sideEffect : () => {},
        canDo: obj.canDo !== undefined ? obj.canDo : () => true,
      };
    }
  }

  addNewQueue(drainAmt: number, manual: boolean = true) {
    if (this.queueData) {
      this.queueData.queue.push({
        remain: drainAmt,
        onStart: drainAmt,
        time: getTime(),
        drainFactor: this.queueData.k,
        c: this.queueData.c,
        lastRemain: 0,
        manual: manual,
      });
    }
  }

  get isNotFull() {
    if (this.queueData) {
      return this.owned < this.queueData.req;
    }
    throw new Error(
      'Can not perform isFull on Resource that does not have queueData'
    );
  }

  isEmpty(notFull: boolean = true) {
    if (this.queueData) {
      return (
        (notFull ? this.isNotFull : true) &&
        this.queueData.queue.find((element) => {
          return element.manual === true;
        }) === undefined
      );
    }
    throw new Error(
      'Can not perform isEmpty on Resource that does not have queueData'
    );
  }

  update() {
    if (this.queueData) {
      for (const [num, data] of this.queueData.queue.entries()) {
        if (isOfType<QueueType>(data, 'c') && this.queueData.canDo()) {
          data.lastRemain = data.remain;
          data.remain = this.queueData.gainPerTick(data);
          // (c+1)/c because of start errors
          // now todo: figure out c and k's effect on result
          this.owned += data.lastRemain - data.remain;
          this.queueData.sideEffect(data.lastRemain - data.remain);
          if (this.owned > this.queueData.req) {
            this.queueData.queue = [];
            this.owned = this.queueData.req;
          } else if (data.remain < 0.01) {
            this.owned += data.remain;
            this.queueData.queue.splice(num, 1);
          }
        }
      }
    }
  }
}
export { Resource };
