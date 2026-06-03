import { onCleanup, onMount } from "solid-js";
import { onEnter, onLeave, useTransitionDirection } from "./hooks";
import { useController } from "./context";
import type { TransitionRunner } from "../types";

/**
 * These presets use the Web Animations API so the package has zero animation
 * dependencies. Swap in GSAP/Motion by writing your own runner with onEnter /
 * onLeave — the contract is just "return a promise that resolves when done".
 */

const animate = (el: HTMLElement, keyframes: Keyframe[], ms: number) =>
  el.animate(keyframes, { duration: ms, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" })
    .finished.then(() => void el.getAnimations().forEach((a) => a.commitStyles?.()));

/**
 * Classic cross-fade: outgoing fades to 0 while incoming fades from 0. Because
 * both branches are mounted and overlaid, the fade actually overlaps rather
 * than being a fade-out-then-fade-in like the current hacky approach.
 */
export function useCrossFade(ms = 400): void {
  const controller = useController();

  onMount(() => controller.setOverlap(true));
  onCleanup(() => controller.setOverlap(false));

  const leave: TransitionRunner = (_ctx, el) =>
    animate(el, [{ opacity: 1 }, { opacity: 0 }], ms);
  const enter: TransitionRunner = (_ctx, el) =>
    animate(el, [{ opacity: 0 }, { opacity: 1 }], ms);
  onLeave(leave);
  onEnter(enter);
}

/**
 * Directional slide: forward pushes incoming from the right, backward from the
 * left. Outgoing slides the opposite way. Reads live direction from the
 * controller so back/forward feel native.
 */
export function useDirectionalSlide(distance = 48, ms = 450): void {
  const controller = useController();
  const direction = useTransitionDirection();

  onMount(() => controller.setOverlap(true));
  onCleanup(() => controller.setOverlap(false));

  const leave: TransitionRunner = (_ctx, el) => {
    const dir = direction();
    const dx = dir === "backward" ? distance : -distance;
    return animate(
      el,
      [
        { transform: "translateX(0)", opacity: 1 },
        { transform: `translateX(${dx}px)`, opacity: 0 },
      ],
      ms,
    );
  };

  const enter: TransitionRunner = (_ctx, el) => {
    const dir = direction();
    const dx = dir === "backward" ? -distance : distance;
    return animate(
      el,
      [
        { transform: `translateX(${dx}px)`, opacity: 0 },
        { transform: "translateX(0)", opacity: 1 },
      ],
      ms,
    );
  };

  onLeave(leave);
  onEnter(enter);
}
