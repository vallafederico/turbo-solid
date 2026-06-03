import { onCleanup, onMount } from "solid-js";
import { useController } from "@acme/router";
import type { TransitionRunner } from "@acme/router";
import gsap from "~/lib/gsap";
import { Scroll } from "~/lib/utils/scroll";

const FADE_S = 0.2;
const SLIDE_S = 1.2;
const ENTER_S = FADE_S + SLIDE_S;
/** Outgoing fade spans almost the full incoming timeline. */
const LEAVE_S = ENTER_S - 0.1;
const OFFSET = "50vh";

/** After overlap presets finish and branch styles reset, sync Lenis limits. */
const refreshScrollAfterTransition = () => {
  queueMicrotask(() => {
    queueMicrotask(() => {
      requestAnimationFrame(() => Scroll.refresh());
    });
  });
};

/**
 * Pages demo overlap transition: cross-fade over 0.2s, then incoming
 * slides up from half a viewport below with expo.out.
 */
export function usePagesCoverTransition(offset = OFFSET): void {
  const controller = useController();

  const leave: TransitionRunner = (_ctx, el) =>
    gsap.to(el, {
      opacity: 0,
      duration: LEAVE_S,
      ease: "none",
    });

  const enter: TransitionRunner = (_ctx, el) => {
    gsap.set(el, { opacity: 0, y: offset });
    return gsap
      .timeline()
      .to(el, { opacity: 1, duration: FADE_S, ease: "none" })
      .to(el, { y: 0, duration: SLIDE_S, ease: "expo.out" })
      .then(() => {
        refreshScrollAfterTransition();
      });
  };

  onMount(() =>
    controller.setOverlapPreset(leave, enter, ENTER_S * 1000),
  );
  onCleanup(() => void controller.clearOverlapPreset());
}
