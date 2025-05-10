import Lenis from "lenis";
import gsap from "./gsap";
import { isServer } from "solid-js/web";
import { Gl } from "./gl/gl";

export class Scroll {
  static previousHeight = 0;
  static subscribers = [];

  static {
    if (!isServer) {
      this.init();
    }
  }

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
      wrapper: document.querySelector("#app"),
      autoResize: false,
    });

    this.handleResize();
    this.lenis.on("scroll", this.onScroll.bind(this));
    gsap.ticker.add((time) => this.lenis.raf(time * 1000));
  }

  static handleResize() {
    new ResizeObserver(([entry]) => {
      if (entry.contentRect.height !== this.previousHeight) {
        this.lenis.resize();
        this.previousHeight = entry.contentRect.height;
      }
    }).observe(document.querySelector("main"));
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
    this.y = scroll;
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
