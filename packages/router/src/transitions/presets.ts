import { onCleanup, onMount } from "solid-js";
import { useTransitionDirection } from "./hooks";
import { useController } from "./context";
import type { TransitionRunner } from "../types";

/**
 * These presets use the Web Animations API so the package has zero animation
 * dependencies. Swap in GSAP/Motion by writing your own runner with onEnter /
 * onLeave — the contract is just "return a promise that resolves when done".
 */

const animate = (el: HTMLElement, keyframes: Keyframe[], ms: number) =>
  el
    .animate(keyframes, {
      duration: ms,
      easing: "cubic-bezier(.4,0,.2,1)",
      fill: "both",
    })
    .finished.then(() => void el.getAnimations().forEach((a) => a.commitStyles?.()));

/**
 * Classic cross-fade: outgoing fades to 0 while incoming fades from 0. Both
 * branch wrappers stay mounted and overlaid — the router snapshots the outgoing
 * page and mounts the incoming page on top before running these in parallel.
 */
export function useCrossFade(ms = 400): void {
  const controller = useController();

  const leave: TransitionRunner = (_ctx, el) =>
    animate(el, [{ opacity: 1 }, { opacity: 0 }], ms);
  const enter: TransitionRunner = (_ctx, el) =>
    animate(el, [{ opacity: 0 }, { opacity: 1 }], ms);

  onMount(() => controller.setOverlapPreset(leave, enter, ms));
  onCleanup(() => void controller.clearOverlapPreset());
}

/**
 * Directional slide: forward pushes incoming from the right, replace from the
 * left. Outgoing slides the opposite way. Reads live direction from the
 * controller. (Browser back/forward swaps instantly, so `backward` only applies
 * if you drive it via your own navigation logic.)
 */
export function useDirectionalSlide(distance = 48, ms = 450): void {
  const controller = useController();
  const direction = useTransitionDirection();

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

  onMount(() => controller.setOverlapPreset(leave, enter, ms));
  onCleanup(() => void controller.clearOverlapPreset());
}

const hold = (ms: number): TransitionRunner => () =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Incoming page mounts offset down (default half viewport), slides up over the
 * outgoing page, then the outgoing branch unmounts once the enter finishes.
 * Outgoing stays fully visible underneath until then.
 */
export function useCoverSlideUp(ms = 3000, offset = "50vh"): void {
  const controller = useController();

  const leave = hold(ms);
  const enter: TransitionRunner = (_ctx, el) => {
    el.style.opacity = "1";
    el.style.transform = `translateY(${offset})`;
    return animate(
      el,
      [
        { transform: `translateY(${offset})` },
        { transform: "translateY(0)" },
      ],
      ms,
    );
  };

  onMount(() => controller.setOverlapPreset(leave, enter, ms));
  onCleanup(() => void controller.clearOverlapPreset());
}
