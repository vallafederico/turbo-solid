import { createEffect } from "solid-js";
import { makeResizeObserver } from "@solid-primitives/resize-observer";
import { viewport, setViewport } from "~/lib/stores/viewportStore";

export function useViewport() {
  createEffect(() => {
    setViewport("size", {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    initResize();
  });
}

/** -- Resize */
const initResize = (ref = document.body) => {
  const handleObserverCallback = (entries: ResizeObserverEntry[]) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setViewport("size", { width, height });
    // console.log("resize", viewport);
  };

  const { observe, unobserve } = makeResizeObserver(handleObserverCallback, {
    box: "content-box",
  });

  observe(document.body);
};
