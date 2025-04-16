import gsap from "./gsap";
import { isClient } from "../lib/utils/isClient";

// raf
export class Raf {
  static subscribers = [];
  static {
    if (isClient) {
      this.init();
    }
  }

  static subscribe(sub, id = Symbol()) {
    if (!this.subscribers.find(({ id: _id }) => _id === id))
      this.subscribers.push({ sub, id });

    return this.unsubscribe.bind(this, id);
  }

  static unsubscribe(id) {
    this.subscribers = this.subscribers.filter(({ id: _id }) => _id !== id);
  }

  static init() {
    gsap.ticker.add((time) => this.render(time * 1000));
  }

  static render(t) {
    this.subscribers.forEach(({ sub }) => sub(t));
  }
}
