import { R, isUndef, getTime } from "../main/utils";
import type { ResourceInputType, QueueType, ResourceType } from "../main/types";
import { isOfType } from "../main/types";
class Resource implements ResourceType {
  owned: number;
  multi: number;
  req?: number;
  k?: number;
  c?: number;
  queue?: QueueType[];
  constructor(obj: ResourceInputType = {}) {
    this.owned = R(obj.owned, 0);
    this.multi = R(obj.multi, 1);
    // req to max
    // left to drain
    if (!isUndef(obj.req)) {
      this.req = obj.req;
      this.k = 1;
      this.c = 5;
      this.queue = [];
    }
  }

  addNewQueue(drainAmt: number) {
    if (this.queue) {
      this.queue.push({
        remain: drainAmt,
        onStart: drainAmt,
        time: getTime(),
        drainFactor: this.k as number,
        c: this.c as number,
        lastRemain: 0,
      });
    }
  }

  update() {
    if (this.queue) {
      for (const [num, data] of this.queue.entries()) {
        if (isOfType<QueueType>(data, "c")) {
          data.lastRemain = data.remain;
          data.remain =
            ((data.onStart * (data.c + 1)) / data.c) *
            (1 -
              1 /
                (1 +
                  data.c *
                    Math.E **
                      ((-data.drainFactor * (getTime() - data.time)) / 1000)));
          // (c+1)/c because of start errors
          // now todo: figure out c and k's effect on result
          this.owned += data.lastRemain - data.remain;
          if (typeof this.req === "number" && this.owned > this.req) {
            this.queue = [];
            this.owned = this.req;
          } else if (data.remain < 0.01) {
            this.owned += data.remain;
            this.queue.splice(num, 1);
          }
        }
      }
    }
  }
}
export { Resource };
