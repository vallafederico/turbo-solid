import gsap from "@/lib/gsap";
import { Subscribable } from "@/lib/subscribable";

class RafLoop extends Subscribable<number> {
  private initialized = false;
  private render = (time: number) => this.notify(time * 1000);

  init(): void {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;
    gsap.ticker.add(this.render);
  }

  destroy(): void {
    if (!this.initialized) return;
    gsap.ticker.remove(this.render);
    this.initialized = false;
    this.clear();
  }
}

const globalRaf = globalThis as typeof globalThis & {
  __nextAnimationRaf?: RafLoop;
};

export const Raf = globalRaf.__nextAnimationRaf ?? new RafLoop();
globalRaf.__nextAnimationRaf = Raf;

const hot = (
  import.meta as ImportMeta & {
  hot?: {
    dispose: (callback: () => void) => void;
  };
  }
).hot;

if (hot) {
  hot.dispose(() => {
    Raf.destroy();
  });
}
