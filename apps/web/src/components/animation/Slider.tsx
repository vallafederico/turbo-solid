import { createSignal } from "solid-js";
import { useSlider, styles } from "~/animation/slider";

export default function Slider({
  class: className = "",
  childClass = "",
  children,
}: {
  class?: string;
  childClass?: string;
  children?: any;
} = {}) {
  const animate = (self) => {
    /** initialise with params */
    // let [enable, setEnable] = createSignal(true);
    // let [mode, setMode] = createSignal(false);

    // onSlide(self, {
    //   onSlideChange: (i: number) => {
    //     // console.log("slidechanged", i);
    //   },
    //   onSlideSettle: (i: number) => {
    //     // console.log("slideSettled", i);
    //   },
    //   enable,
    //   mode,
    // });

    /** initialise with defaults */
    useSlider(self);

    // setTimeout(() => {
    //   setMode(true);
    // }, 3000);
  };

  const arr = Array.from({ length: 10 }, (v, i) => i);

  return (
    <div use:animate class={className + styles.wrapper}>
      {children
        ? children
        : arr.map((item) => (
            <div class={childClass + styles.children}>{item}</div>
          ))}
    </div>
  );
}
