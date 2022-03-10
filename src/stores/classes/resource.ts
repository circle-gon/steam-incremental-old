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

  update() {
    if (this.queueData) {
      for (const [num, data] of this.queueData.queue.entries()) {
        if (isOfType<QueueType>(data, 'c')) {
          data.lastRemain = data.remain;
          data.remain = this.queueData.gainPerTick(data);
          // (c+1)/c because of start errors
          // now todo: figure out c and k's effect on result
          this.owned += data.lastRemain - data.remain;
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
