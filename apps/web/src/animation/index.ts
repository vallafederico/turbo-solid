import { setCtrlTransition } from "~/stores/controllerStore";
import { createStore } from "solid-js/store";
import { Scroll } from "~/app/scroll";

/** animations */
import { globalOut } from "./global";

/** page/router controllers */
const [outTransitions, setOutTransition] = createStore({
  elements: [globalOut],
});

/** -- page transitions */
async function animateOutAndTransition(
  to: string,
  el: HTMLAnchorElement,
  navigate: any,
  location: any,
) {
  if (location.pathname === to) return;
  setCtrlTransition(to);

  await Promise.all(outTransitions.elements.map(async (fn) => await fn()));
  await navigate(el.pathname);
  Scroll.lenis?.resize();

  reset();
}

function reset() {
  setOutTransition({
    elements: [globalOut],
  });
}

/** exports */
export { animateOutAndTransition, setOutTransition, outTransitions };
export { onPageLeave, onIntersect } from "./lib/lifecycle";
export { onScroll, onTrack } from "./lib/scrolling";
