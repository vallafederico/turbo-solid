import { onCleanup } from "solid-js";
import { onEnter, onLeave } from "./hooks";
import { useController } from "./context";
import type { TransitionContextValue, TransitionRunner } from "../types";

const fade = (el: HTMLElement, keyframes: Keyframe[], ms: number) =>
  el
    .animate(keyframes, {
      duration: ms,
      easing: "cubic-bezier(.4,0,.2,1)",
      fill: "both",
    })
    .finished.then(() => {
      el.getAnimations().forEach((a) => a.commitStyles?.());
    });

export interface LayoutTransitionOptions {
  /** Branch leave — after `beforeLeave` hooks, before enter. Defaults to opacity fade. */
  leave?: TransitionRunner;
  /** Branch enter — after outgoing leave completes. Defaults to opacity fade. */
  enter?: TransitionRunner;
  /** Called before the enter runner (scroll restore, etc.). */
  onEnter?: (ctx: TransitionContextValue, el: HTMLElement) => void;
  /** Fade duration (ms) when using default leave/enter. */
  durationMs?: number;
}

const defaultLeave =
  (ms: number): TransitionRunner =>
  (_ctx, el) =>
    fade(el, [{ opacity: 1 }, { opacity: 0 }], ms);

const defaultEnter =
  (ms: number): TransitionRunner =>
  (_ctx, el) =>
    fade(el, [{ opacity: 0 }, { opacity: 1 }], ms);

/**
 * Register global layout enter/leave on the branch wrapper. Call once in the
 * persistent app shell (inside `<Router transition={…}>`). Page components
 * use `beforeLeave` / `onLeave` / `onEnter` for scoped animations.
 */
export function useLayoutTransition(options: LayoutTransitionOptions = {}): void {
  const controller = useController();
  const ms = options.durationMs ?? 400;
  const leave = options.leave ?? defaultLeave(ms);
  const enter = options.enter ?? defaultEnter(ms);

  if (options.onEnter) {
    onCleanup(
      controller.registerIncomingMount((ctx, el) => options.onEnter!(ctx, el)),
    );
  }

  onLeave((_ctx, el) => {
    if (controller.hasCustomTransition()) return;
    return leave(_ctx, el);
  });

  onEnter(async (ctx, el) => {
    if (!controller.isActive()) {
      el.style.opacity = "1";
      return;
    }
    if (controller.hasCustomTransition()) return;
    el.style.opacity = "0";
    await enter(ctx, el);
  });
}
