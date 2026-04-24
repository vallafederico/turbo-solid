import { onMount, onCleanup, createSignal } from "solid-js";
import { isServer } from "solid-js/web";
import Core, { CoreConfig } from "smooothy";
import gsap from "~/lib/gsap";

export function useSmooothy(config: Partial<CoreConfig> = {}) {
  let sliderRef: HTMLElement | null = null;
  const [slider, setSlider] = createSignal<Core | null>(null);

  const refCallback = (node: HTMLElement | null) => {
    sliderRef = node;
    return node;
  };

  onMount(() => {
    if (!isServer && sliderRef && !slider()) {
      const instance = new Core(sliderRef, config);
      gsap.ticker.add(instance.update.bind(instance));
      setSlider(instance);
    }
  });

  onCleanup(() => {
    const sliderInstance = slider();
    if (sliderInstance) {
      gsap.ticker.remove(sliderInstance.update.bind(sliderInstance));
      sliderInstance.destroy();
    }
  });

  return {
    ref: refCallback,
    slider,
  };
}
