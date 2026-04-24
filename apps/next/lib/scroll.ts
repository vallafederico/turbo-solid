import type Lenis from "lenis";
import type { ScrollToOptions } from "lenis";

import { Subscribable } from "@/lib/subscribable";

export interface ScrollEvent {
  velocity: number;
  scroll: number;
  direction: 1 | -1;
  progress: number;
  glScroll: number;
}

class ScrollState extends Subscribable<ScrollEvent> {
  lenis?: Lenis;
  private glPixelRatio?: number;

  setLenis(lenis?: Lenis): void {
    this.lenis = lenis;
  }

  setGlPixelRatio(pixelRatio: number): void {
    this.glPixelRatio = pixelRatio;
  }

  get gl(): number {
    const scroll = this.lenis?.scroll ?? 0;
    return this.glPixelRatio ? scroll * this.glPixelRatio : scroll;
  }

  get scrollEventData(): ScrollEvent {
    const direction = this.lenis?.direction;

    return {
      velocity: this.lenis?.velocity ?? 0,
      scroll: this.lenis?.scroll ?? 0,
      direction: direction === -1 ? -1 : 1,
      progress: this.lenis?.progress ?? 0,
      glScroll: this.gl,
    };
  }

  handleScroll(lenis: Lenis): void {
    this.setLenis(lenis);
    this.notify(this.scrollEventData);
  }

  resize(): void {
    this.lenis?.resize();
  }

  to(target: number | string | HTMLElement, options?: ScrollToOptions): void {
    this.lenis?.scrollTo(target, options);
  }
}

export const Scroll = new ScrollState();
