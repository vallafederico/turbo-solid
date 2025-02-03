import Lenis from "lenis";
import gsap from "./gsap";
import { isClient } from "../utils/isClient";
import { Gl } from "./gl/gl";

// (*) restructure in a smarter way
export class Scroll {
  static subscribers = [];

  static {
    if (isClient) {
      this.init();
    }
  }

  // attach scroll to wrapper

  static subscribe(sub, id) {
    if (!this.subscribers.find(({ id: _id }) => _id === id))
      this.subscribers.push({ sub, id });

    return () => this.unsubscribe(id);
  }

  static unsubscribe(id) {
    this.subscribers = this.subscribers.filter(({ id: _id }) => _id !== id);
  }

  static init() {
    this.y = window.scrollY || 0;
    this.lenis = new Lenis({
      wrapper: document.querySelector("[data-scroll]"),
    });

    gsap.ticker.add((time) => this.lenis.raf(time * 1000));

    this.lenis.on("scroll", ({ velocity, scroll, direction, progress }) => {
      this.y = scroll;

      this.onScroll({ velocity, scroll, direction, progress });
    });
  }

  static get scrollEventData() {
    return {
      velocity: this.lenis.velocity,
      scroll: this.lenis.scroll,
      direction: this.lenis.direction,
      progress: this.lenis.progress,
    };
  }

  static onScroll({ velocity, scroll, direction, progress }) {
    let glScroll = scroll;

    if (Gl && Gl.vp) {
      glScroll = scroll * Gl.vp.px;
    }

    this.subscribers.forEach(({ sub }) => {
      sub({ velocity, scroll, direction, progress, glScroll });
    });
  }

  static to(params) {
    this.lenis.scrollTo(params);
  }
}

// Scroll.init();
