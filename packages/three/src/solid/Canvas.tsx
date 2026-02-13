import { onCleanup, onMount } from "solid-js";
import { setGlContext } from "@local/gl-context";
import { Gl } from "../gl";

export interface CanvasDeps {
  gsap: any;
  Gui: any;
  lerp: (a: number, b: number, t: number) => number;
  Scroll: any;
  Resizer: any;
  setWebgl: (v: any) => void;
  assets: any;
  clientRectGl: (el: HTMLElement) => any;
}

export interface CanvasProps {
  deps: CanvasDeps;
  class?: string;
}

export default function Canvas(props: CanvasProps) {
  const webgl = (el: HTMLDivElement) => {
    onMount(() => {
      setGlContext(props.deps);
      Gl.start(el);
    });

    onCleanup(() => {
      Gl.destroy();
    });
  };

  return (
    <div
      use:webgl
      class={props.class ?? "fixed inset-0 z-[-1] h-screen w-screen"}
    />
  );
}
