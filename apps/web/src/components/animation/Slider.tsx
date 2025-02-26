import cx from "classix";
import { createSignal } from "solid-js";
import { useSlider, styles } from "~/animation/slider";
import { useWindowResize } from "~/lib/hooks/useWindowResize";

export default function Slider({
  class: className = "",
  childClass = "",
  children,
}: {
  class?: string;
  childClass?: string;
  children?: any;
} = {}) {
  const animate = (self: HTMLDivElement) => {
    /** initialise with params */
    let [enable, setEnable] = createSignal(true);
    let [mode, setMode] = createSignal(false);

    useSlider(self, {
      onSlideChange: (i: number) => {
        // console.log("slidechanged", i);
      },
      onSlideSettle: (i: number) => {
        // console.log("slideSettled", i);
      },
      enable,
      mode,
    });

    /** initialise with defaults */
    // useSlider(self);

    setTimeout(() => {
      setMode(true);
    }, 3000);

    useWindowResize(({ width }) => {
      if (width < 800) {
        setEnable(false);
      } else {
        setEnable(true);
      }
    });
  };

  const arr = Array.from({ length: 10 }, (v, i) => i);

  return (
    <div use:animate class={cx(className, styles.wrapper)}>
      {children
        ? children
        : arr.map((item) => (
            <div class={cx(childClass, styles.children, "outline-1")}>
              {item}
            </div>
          ))}
    </div>
  );
}
