import {
  createEffect,
  onCleanup,
  createUniqueId,
  createSignal,
} from "solid-js";
import { Scroll } from "~/app/scroll";
import { Raf } from "~/app/raf";
import { clientRect } from "~/lib/utils/clientRect";
import { clamp, map, lerp as lerpFunc } from "~/lib/utils/math";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import { viewport } from "~/lib/stores/viewportStore";

interface ScrollEvent {
  velocity: number;
  scroll: number;
  direction: 1 | -1;
}

/** -- generic scroll event */

export function onScroll(fn: Function) {
  const id = createUniqueId();

  createEffect(() => {
    Scroll.add((value: ScrollEvent) => fn(value), 0);
  });

  onCleanup(() => {
    Scroll.remove(id);
  });
}

/** -- scroll tracking event */

function computeBounds(
  el: HTMLElement,
  config: { top: string; bottom: string },
) {
  const bounds = clientRect(el);

  switch (config.top) {
    case "top":
      bounds.top = bounds.top;
      break;
    case "center":
      bounds.top = bounds.top - bounds.wh / 2;
      break;
    case "bottom":
      bounds.top = bounds.top - bounds.wh;
      break;
  }

  switch (config.bottom) {
    case "top":
      bounds.bottom = bounds.bottom;
      break;
    case "center":
      bounds.bottom = bounds.bottom - bounds.wh / 2;
      break;
    case "bottom":
      bounds.bottom = bounds.bottom - bounds.wh;
      break;
  }

  return { ...bounds };
}

export function onTrack(
  track: HTMLElement,
  fn: Function,
  {
    top = "bottom",
    bottom = "top",
    lerp = false,
  }: {
    top?: "top" | "center" | "bottom";
    bottom?: "top" | "center" | "bottom";
    lerp?: number | false;
  } = {},
): void {
  const subscriber = lerp === false ? Scroll : Raf;
  const vo = createVisibilityObserver({ threshold: 0 });
  const visible = vo(track);

  const [bounds, setBounds] = createSignal(
    computeBounds(track, { top, bottom }),
  );

  let lerped = 0;

  createEffect(() => {
    viewport.size.height;
    viewport.size.width;
    setBounds(computeBounds(track, { top, bottom }));
  });

  const execute = (scroll = Scroll.scrollEventData) => {
    let val = clamp(
      0,
      1,
      map(scroll.scroll, bounds().top, bounds().bottom, 0, 1),
    );

    if (lerp !== false) {
      lerped = lerpFunc(lerped, val, lerp); // (*) SWAP TO DAMP < framerate independent
      val = lerped;
    }

    fn(val, scroll);
  };

  let remove: Function | null = null;
  createEffect(() => {
    remove = subscriber.add(() => {
      if (!visible()) return;
      execute(Scroll.scrollEventData);
    });

    execute();
  });

  onCleanup(() => {
    if (remove) remove();
  });
}
