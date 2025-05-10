import gsap from "./gsap";
import { isServer } from "solid-js/web";
import { Subscribable } from "./gl/subscribable";

class _Raf extends Subscribable {
  subscribers = [];

  constructor() {
    super();

    if (!isServer) {
      this.init();
    }
  }

  init() {
    gsap.ticker.add((time) => this.render(time * 1000));
  }

  render(t) {
    this.notify(t);
  }
}

export const Raf = new _Raf();
