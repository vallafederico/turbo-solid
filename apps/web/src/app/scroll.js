import Lenis from "lenis";
import gsap from "./gsap";
import { isServer } from "solid-js/web";
import { Subscribable } from "./subscribable";
import { Gl } from "./gl/gl";

export const scroll = (el) => {
  Scroll.handleResize(el);
};

///////////////////////////////

class _Scroll extends Subscribable {
  previousHeight = 0;
  subscribers = [];

  constructor() {
    super();

    if (!isServer) {
      this.init();
    }
  }

  init() {
    this.y = window.scrollY || 0;
    this.lenis = new Lenis({
      wrapper: document.querySelector("#app"),
      autoResize: false,
    });

    this.lenis.on("scroll", this.onScroll.bind(this));
    gsap.ticker.add((time) => this.lenis.raf(time * 1000));
  }

  handleResize(item) {
    new ResizeObserver(([entry]) => {
      if (entry.contentRect.height !== this.previousHeight) {
        this.lenis.resize();
        this.previousHeight = entry.contentRect.height;
      }
    }).observe(item);
  }

  get scrollEventData() {
    return {
      velocity: this.lenis.velocity,
      scroll: this.lenis.scroll,
      direction: this.lenis.direction,
      progress: this.lenis.progress,
    };
  }

  onScroll({ velocity, scroll, direction, progress }) {
    this.y = scroll;
    let glScroll = scroll;

    if (Gl && Gl.vp) {
      glScroll = scroll * Gl.vp.px;
    }

    this.notify({ velocity, scroll, direction, progress, glScroll });
  }

  to(params) {
    this.lenis.scrollTo(params);
  }

  destroy() {
    this.lenis.destroy();
  }
}

export const Scroll = new _Scroll();
