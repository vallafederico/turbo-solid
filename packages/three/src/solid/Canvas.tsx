import { onCleanup, onMount } from "solid-js";
import { setGlContext } from "@local/gl-context";
import { Gl } from "../gl";
import type { SolidCanvasProps as CanvasProps } from "../canvasTypes";

export type { CanvasDeps, SolidCanvasProps } from "../canvasTypes";

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
