import { setCtrlTransition } from "~/lib/stores/controllerStore";
import { Scroll } from "~/app/scroll";

/** animations */
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

/** -- page transitions */
async function animateOutAndTransition(
  to: string,
  el: HTMLAnchorElement,
  navigate: any,
  location: any,
) {
  if (location.pathname === to) return;
  setCtrlTransition(to);

  await Promise.all(outTransitions.map(async (fn) => await fn()));
  reset();
  await navigate(el.pathname);
  Scroll.lenis?.scrollTo(0, { immediate: true });
  Scroll.lenis?.resize();
}

/** exports */
export { animateOutAndTransition, setOutTransition, outTransitions };
export { onPageLeave, onIntersect } from "./lib/lifecycle";
export { onScroll, onTrack } from "./lib/scrolling";
