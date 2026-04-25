import {
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { isServer } from "solid-js/web";

function getGridValues() {
  const computed = getComputedStyle(
    document.documentElement,
  );
  const gx = computed.getPropertyValue("--gx");
  const gutter = computed.getPropertyValue("--gutter");
  const columns = computed.getPropertyValue("--columns");

  return { gx, gutter, columns };
}

export default function Grid() {
  // We never render the grid on the server: it depends on `--columns`
  // (computed from `getComputedStyle`) and on `localStorage`, both of which
  // are client-only. Rendering 12 placeholder divs SSR-side and then
  // replacing them on mount caused hydration mismatches.
  const [mounted, setMounted] = createSignal(false);
  const [columns, setColumns] = createSignal(0);
  const [visible, setVisible] = createSignal(false);

  const handleResize = () => {
    const { columns: c } = getGridValues();
    setColumns(+c || 0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!e.shiftKey) return;
    if (e.key === "G") {
      const next = !visible();
      setVisible(next);
      localStorage.setItem("grid", next.toString());
    }
  };

  onMount(() => {
    handleResize();

    const stored = localStorage.getItem("grid");
    if (stored !== null) setVisible(stored === "true");

    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeyDown);

    setMounted(true);
  });

  onCleanup(() => {
    // `onCleanup` also runs during SSR teardown — guard the browser globals.
    if (isServer) return;
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("keydown", handleKeyDown);
  });

  const styles =
    "gap-[var(--gutter)] fixed pointer-events-none left-0 top-0 z-10 flex h-[100vh] justify-between px-gx";

  return (
    <Show when={mounted()}>
      <div
        class={visible() ? styles : "invisible"}
        style="width: calc(100vw - var(--scrollbar-w, 0px))"
      >
        <For each={Array.from({ length: columns() })}>
          {() => <div class="bg-red-500 opacity-10 grow" />}
        </For>
      </div>
    </Show>
  );
}
