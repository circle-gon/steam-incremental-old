import { R, getTime } from "../main/utils";
import type {
  ResourceInputType,
  QueueType,
  ResourceType,
  GainType,
} from "../main/types";
import { isOfType } from "../main/typeUtils";
import { upThenDown as defaultQueue } from "../main/queue-gpt";
function resourceError(func: string): Error {
  throw new Error(
    `Can not perform ${func} on Resource that does not have queueData`
  );
}
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
        sideEffect:
          obj.sideEffect !== undefined
            ? obj.sideEffect
            : () => {
                return undefined;
              },
        canDo: obj.canDo !== undefined ? obj.canDo : () => true,
      };
    }
  }

  addNewQueue(drainAmt: number, manual = true) {
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
    throw resourceError("isNotFull");
  }

  resetToMax() {
    if (this.queueData) {
      this.owned = Math.min(this.queueData.req, this.owned);
    } else {
      throw resourceError("resetToMax");
    }
  }

  isEmpty(notFull = true) {
    if (this.queueData) {
      return (
        (notFull ? this.isNotFull : true) &&
        !this.queueData.queue.some((element) => {
          return element.manual === true;
        })
      );
    }
    throw resourceError("isEmpty");
  }

  update() {
    if (this.queueData) {
      for (const [num, data] of this.queueData.queue.entries()) {
        if (isOfType<QueueType>(data, "c") && this.queueData.canDo()) {
          data.lastRemain = data.remain;
          data.remain = this.queueData.gainPerTick(data);
          // (c+1)/c because of start errors
          // now todo: figure out c and k's effect on result
          const diff = data.lastRemain - data.remain;
          this.owned += diff;
          this.queueData.sideEffect(diff);
          if (this.owned > this.queueData.req) {
            this.queueData.queue = [];
            this.owned = this.queueData.req;
          } else if (data.remain < 0.01) {
            this.owned += data.remain;
            this.queueData.sideEffect(data.remain);
            this.queueData.queue.splice(num, 1);
          }
        }
      }
    }
  }
}
export { Resource };
