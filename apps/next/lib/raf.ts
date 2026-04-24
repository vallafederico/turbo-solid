import gsap from "@/lib/gsap";
import { Subscribable } from "@/lib/subscribable";

class RafLoop extends Subscribable<number> {
  private initialized = false;

  init(): void {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;
    gsap.ticker.add((time: number) => this.notify(time * 1000));
  }
}

export const Raf = new RafLoop();
