import cx from "classix";
import Core from "smooothy";
import { onMount, onCleanup } from "solid-js";
import { Raf } from "~/app/raf";

export const useSlider = (
  config = {
    infinite: true,
    snap: true,
  },
) => {
  let sliderRef: HTMLDivElement;
  let slider: any;
  let raf: () => void;

  const setSliderRef = (el: HTMLDivElement) => {
    sliderRef = el;
  };

  onMount(() => {
    if (!sliderRef) return;

    slider = new Core(sliderRef, {
      ...config,
    });

    raf = Raf.subscribe(() => {
      slider.update();
    });
  });

  onCleanup(() => {
    if (!slider) return;
    slider.destroy();
    raf();
  });

  return { slider, ref: setSliderRef };
};

export default function Slider({
  class: className,
  children,
  ...rest
}: {
  class?: string;
  children?: any;
  rest?: { [key: string]: any };
} = {}) {
  const { ref, slider } = useSlider();

  return (
    <div ref={ref} class={cx(className)} {...rest}>
      {children}
    </div>
  );
}
