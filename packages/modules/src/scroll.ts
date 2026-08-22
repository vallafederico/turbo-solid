import Lenis from "lenis";

export type ScrollEvent = {
  velocity: number;
  scroll: number;
  direction: 1 | -1;
  progress: number;
};

export type ScrollHandle = {
  lenis: Lenis;
  y: number;
  to: (target: number | string | HTMLElement, options?: Record<string, unknown>) => void;
  resize: () => void;
  raf: (timeMs: number) => void;
  subscribe: (fn: (event: ScrollEvent) => void) => () => void;
  destroy: () => void;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Document-root Lenis, matching Study Hall + the vite/astro starters.
 * Solid/Next keep their own `#app` wrapper Lenis; this is the MPA version.
 */
export function createScroll(options: ConstructorParameters<typeof Lenis>[0] = {}): ScrollHandle {
  const listeners = new Set<(event: ScrollEvent) => void>();

  const lenis = new Lenis({
    duration: 1,
    smoothWheel: true,
    easing: easeOutExpo,
    orientation: "vertical",
    smoothTouch: false,
    touchMultiplier: 2,
    autoRaf: false,
    ...options,
  });

  const handle: ScrollHandle = {
    lenis,
    y: window.scrollY || 0,
    to(target, opts) {
      lenis.scrollTo(target as never, {
        offset: 0,
        duration: 0.8,
        easing: easeOutExpo,
        immediate: false,
        ...opts,
      });
    },
    resize() {
      lenis.resize();
    },
    raf(timeMs) {
      lenis.raf(timeMs);
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    destroy() {
      listeners.clear();
      lenis.destroy();
    },
  };

  lenis.on("scroll", ({ scroll, velocity, progress, direction }) => {
    handle.y = scroll || 0;
    const event: ScrollEvent = {
      velocity: velocity || 0,
      scroll: scroll || 0,
      direction: direction === -1 ? -1 : 1,
      progress: progress || 0,
    };
    listeners.forEach((fn) => fn(event));
  });

  return handle;
}
