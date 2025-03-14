import { createEffect, createUniqueId, onCleanup } from "solid-js";
import { Raf } from "~/app/raf";
import { viewport } from "~/lib/stores/viewportStore";
import { SliderApi } from "~/animation/slider/lib";

export const styles = {
  wrapper: " flex min-h-[50vh] w-[50vw] max-w-[50vw]  ",
  children: " relative min-w-[35vw] shrink-0  ",
};

// (*) SLIDER PARAMS
/*
- props for mobile enable / disable
- props for snapping / no snapping
- props for infinite / no infinite
- props for parallax / no parallax
- props for settling amount
- props for bouncy
- props for lerp
*/

export const useSlider = (
  self: HTMLDivElement,
  {
    onSlideChange,
    onSlideSettle,
    enable,
    mode,
  }: {
    onSlideChange?: (i: number) => void;
    onSlideSettle?: (i: number) => void;
    enable?: () => boolean;
    mode?: () => boolean;
    // (*) TODO ADD PARAMS
  } = {},
) => {
  let slider: any;

  createEffect(() => {
    const id = createUniqueId();
    slider = new SliderApi(self);

    if (onSlideChange) slider.on("change", onSlideChange);
    if (onSlideSettle) slider.on("settle", onSlideSettle);

    Raf.subscribe(() => {
      slider.update();
    }, id);

    onCleanup(() => {
      Raf.unsubscribe(id);
      slider.removeEvents();
    });

    slider.resize();
  });

  createEffect(() => {
    if (enable && mode) {
      slider._enabled = enable();
      slider._snapMode = mode();
    }
  });

  createEffect(() => {
    slider.resize(viewport.size.width);
  });
};

// root api directive
export const slide = (self: HTMLDivElement) => {
  createEffect(() => {
    const id = createUniqueId();
    let slider = new SliderApi(self);

    Raf.subscribe(() => {
      slider.update();
    }, id);

    onCleanup(() => {
      Raf.unsubscribe(id);
      slider.removeEvents();
    });
  });
};
