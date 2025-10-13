import Lenis from "lenis";
import gsap from "~/lib/gsap";
import { isServer } from "solid-js/web";
import { Subscribable } from "./subscribable";

export interface ScrollEvent {
  velocity: number;
  scroll: number;
  direction: 1 | -1;
  progress: number;
  glScroll: number;
}

export const scroll = (el: HTMLElement) => {
  Scroll.handleResize(el);
};

class _Scroll extends Subscribable<ScrollEvent> {
  previousHeight = 0;
  y = 0;
  lenis?: Lenis;

  constructor() {
    super();

    if (!isServer) {
      this.init();
    }
  }

  init(): void {
    this.y = window.scrollY || 0;
    this.lenis = new Lenis({
      wrapper: document.querySelector("#app"),
      autoResize: false,
    });

    this.lenis.on("scroll", this.onScroll.bind(this));
    gsap.ticker.add((time: number) => this.lenis!.raf(time * 1000));
  }

  handleResize(item: HTMLElement): void {
    new ResizeObserver(([entry]: ResizeObserverEntry[]) => {
      if (entry.contentRect.height !== this.previousHeight) {
        this.lenis?.resize();
        this.previousHeight = entry.contentRect.height;
      }
    }).observe(item);
  }

  get scrollEventData(): ScrollEvent {
    return {
      velocity: this.lenis?.velocity || 0,
      scroll: this.lenis?.scroll || 0,
      direction: this.lenis?.direction || 1,
      progress: this.lenis?.progress || 0,
      glScroll: this.lenis?.scroll || 0, // Will be overridden if Gl is available
    };
  }

  onScroll({ velocity, scroll, direction, progress }: any): void {
    this.y = scroll;
    let glScroll = scroll;

    // Note: Gl import removed to avoid circular dependency
    // glScroll calculation should be handled where Gl is available

    this.notify({ velocity, scroll, direction, progress, glScroll });
  }

  to(params: any): void {
    this.lenis?.scrollTo(params);
  }

  destroy(): void {
    this.lenis?.destroy();
  }
}

export const Scroll = new _Scroll();
