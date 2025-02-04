import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import { createEffect } from "solid-js";
import { setOutTransition, outTransitions } from "../index";

type Callback =
  | ((duration?: number) => void)
  | (() => Promise<gsap.core.Omit<gsap.core.Tween, "then">>);

export function onPageLeave(element: HTMLElement, fn: Callback) {
  const vo = createVisibilityObserver({ threshold: 0 });
  const visible = vo(element);

  console.log(visible());

  const wrappedFn = () => {
    if (visible()) {
      return fn();
    }
    return Promise.resolve();
  };

  setOutTransition("elements", [...outTransitions.elements, wrappedFn]);
}

export function onIntersect(
  ref: HTMLElement,
  { onEnter = () => {}, onLeave = () => {}, once = true, threshold = 0.2 } = {},
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
