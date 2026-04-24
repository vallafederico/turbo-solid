import { createEffect, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

type ResizeCallback = (params: { width: number; height: number }) => void;
let subs: ResizeCallback[] = [];

if (!isServer) {
  //   console.log("init");
  window.addEventListener("resize", () => {
    subs.forEach((sub) =>
      sub({
        width: window.innerWidth,
        height: window.innerHeight,
      }),
    );
  });
}

export const useWindowResize = (callback: ResizeCallback) => {
  subs.push(callback);

  onCleanup(() => {
    subs = subs.filter((sub) => sub !== callback);
  });
};
