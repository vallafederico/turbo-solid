import {
  onEnter,
  onLeave,
  useController,
  type TransitionContextValue,
} from "@acme/router";
import gsap from "~/lib/gsap";
import { Scroll } from "~/lib/utils/scroll";

/** Lenis offset when scrolling to a hash target. */
export const SCROLL_OFFSET = -48;

const MAIN_OUT_DURATION = 0.4;
const MAIN_IN_DURATION = 0.4;

type OutTransition = {
  run: () => void | Promise<void>;
};

/** Page-scoped leave callbacks — drained by the global leave runner before fade-out. */
const outTransitions: OutTransition[] = [];

/** Register a leave animation. Returns unregister — call from `onCleanup`. */
export function registerPageLeave(
  fn: () => void | Promise<void>,
): () => void {
  const entry: OutTransition = { run: fn };
  outTransitions.push(entry);
  return () => {
    const i = outTransitions.indexOf(entry);
    if (i >= 0) outTransitions.splice(i, 1);
  };
}

async function runPageLeaves() {
  if (outTransitions.length === 0) return;
  const pending = outTransitions.splice(0);
  await Promise.all(pending.map((entry) => Promise.resolve(entry.run())));
}

const getHash = (path: string) => {
  if (!path.includes("#")) return null;
  return `#${path.split("#")[1]}`;
};

const resetScroll = (ctx: TransitionContextValue) => {
  if (typeof window === "undefined") return;

  const hash = getHash(ctx.path);
  if (hash) {
    Scroll.lenis?.scrollTo(hash, { offset: SCROLL_OFFSET });
    return;
  }

  Scroll.lenis?.scrollTo(0, { immediate: true });
};

const fadeOut = (el: HTMLElement) =>
  new Promise<void>((resolve) => {
    gsap.to(el, {
      opacity: 0,
      duration: MAIN_OUT_DURATION,
      onComplete: resolve,
    });
  });

const fadeIn = (el: HTMLElement) =>
  new Promise<void>((resolve) => {
    gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: MAIN_IN_DURATION,
        onComplete: resolve,
      },
    );
  });

/**
 * Global route transition — registers enter/leave runners on the branch
 * wrapper from `@acme/router`. Call once inside the app root layout (inside
 * `<Router transition={…}>`).
 */
export function usePageTransition() {
  const controller = useController();

  onLeave(async (_ctx: TransitionContextValue, el: HTMLElement) => {
    await runPageLeaves();
    await fadeOut(el);
  });

  onEnter(async (ctx: TransitionContextValue, el: HTMLElement) => {
    resetScroll(ctx);
    if (!controller.isActive()) {
      gsap.set(el, { opacity: 1 });
      return;
    }
    await fadeIn(el);
  });
}
