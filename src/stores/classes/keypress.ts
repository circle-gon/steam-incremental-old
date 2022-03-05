import type { KeypressClassType } from "../main/types";

class Keypress implements KeypressClassType {
  keypresses: Set<string>;
  constructor() {
    this.keypresses = new Set();
  }

  keydown(e: KeyboardEvent) {
    if (!this.keypresses.has(e.key)) {
      this.keypresses.add(e.key);
    }
  }

  keyup(e: KeyboardEvent) {
    this.keypresses.delete(e.key);
  }

  clear() {
    this.keypresses.clear();
  }
}
export { Keypress };
