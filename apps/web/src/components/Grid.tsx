import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { isClient } from "~/lib/utils/isClient";

function getGridValues() {
  const computed = getComputedStyle(document.documentElement);
  const gx = computed.getPropertyValue("--gx");
  const gutter = computed.getPropertyValue("--gutter");
  const columns = computed.getPropertyValue("--columns");

  return { gx, gutter, columns };
}

export default function Grid({}) {
  const [num, setNum] = createSignal(Array.from({ length: 12 }));

  const handleResize = () => {
    const { columns } = getGridValues(); // gx, gutter,
    setNum(Array.from({ length: +columns }));
  };

  onMount(() => {
    handleResize();
    if (isClient) window.addEventListener("resize", handleResize);

    // get from localstorage
    const grid = localStorage.getItem("grid");
    if (grid) setVisible(grid === "true");
  });

  onCleanup(() => {
    if (isClient) window.removeEventListener("resize", handleResize);
  });

  const [visible, setVisible] = createSignal(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!e.shiftKey) return;

    if (e.key === "G") {
      setVisible(!visible());
      localStorage.setItem("grid", visible().toString());
    }
  };

  createEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
  });

  const styles =
    "gap-[var(--gutter)] fixed pointer-events-none left-0 top-0 z-10 flex h-[100vh] w-screen justify-between px-gx ";

  return (
    <div class={visible() ? styles : "invisible"}>
      {num().map((item) => {
        return <div class="grow bg-red-500 opacity-10"></div>;
      })}
    </div>
  );
}
