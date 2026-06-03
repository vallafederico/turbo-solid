import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import { beforeLeave } from "@acme/router";
import { createEffect } from "solid-js";

type Callback =
  | ((duration?: number) => void)
  | (() => void | Promise<void>);

export function onPageLeave(element?: HTMLElement, fn?: Callback) {
  if (!element || !fn) return;

  // Always run on route leave — visibility is only for scroll-driven onIntersect.
  beforeLeave(() => Promise.resolve(fn()));
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
