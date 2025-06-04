import { onCleanup, onMount } from "solid-js";
import { Gl } from "~/app/gl/gl";

export default function Canvas() {
  const webgl = (self) => {
    onMount(() => {
      Gl.start(self);
    });

    onCleanup(() => {
      Gl.destroy();
    });
  };

  return <div use:webgl class="fixed inset-0 z-[-1] h-screen w-screen"></div>;
}
