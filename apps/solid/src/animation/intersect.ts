import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import { beforeLeave } from "@acme/router";
import { createEffect } from "solid-js";

type Callback =
  | ((duration?: number) => void)
  | (() => Promise<gsap.core.Omit<gsap.core.Tween, "then">>);

export function onPageLeave(element?: HTMLElement, fn?: Callback) {
  if (!element || !fn) return;

  const vo = createVisibilityObserver({ threshold: 0 });
  const visible = vo(element);

  beforeLeave(() => (visible() ? fn() : Promise.resolve()));
}

export function onIntersect(
  ref: HTMLElement,
  { onEnter = () => {}, onLeave = () => {}, once = true, threshold = 0.1 } = {},
) {
  const vo = createVisibilityObserver({ threshold });
  const visible = vo(ref);

  createEffect(() => {
    if (visible()) {
      if (onEnter) onEnter();
    } else {
      if (onLeave) onLeave();
    }
  });
}
