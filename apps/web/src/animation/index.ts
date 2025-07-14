import { Scroll } from "~/app/scroll";
import { globalOut } from "./global";

/* setup */
let outTransitions = [] as (() => any)[];

const setOutTransition = (fn: () => any) => {
  outTransitions.push(fn);
};

function reset() {
  outTransitions.length = 0;
  outTransitions = [];
  outTransitions.push(globalOut);
}

/* -- page transitions */

async function animateOutAndTransition(
  to: string,
  el: HTMLAnchorElement,
  navigate: any,
  location: any,
) {
  if (location.pathname === to) return;

  await Promise.all(outTransitions.map(async (fn) => await fn()));

  reset();

  await navigate(el.pathname);

  Scroll.lenis?.scrollTo(0, { immediate: true });
  // Scroll.lenis?.resize();
}

export async function animateOut() {
  await Promise.all(outTransitions.map(async (fn) => await fn()));
  reset();
}

/** exports */
export { animateOutAndTransition, setOutTransition, outTransitions };

export { onPageLeave, onIntersect } from "./lib/lifecycle";
export { onScroll, onTrack } from "./lib/scrolling";
