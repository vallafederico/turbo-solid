import cx from "classix";
import { createSignal, For, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import { useKeypress } from "~/lib/hooks/useKeypress";
import { useWindowResize } from "~/lib/hooks/useWindowResize";

export default function GridOverlay() {
  const [visible, setVisible] = createSignal(false);
  const [columns, setColumns] = createSignal(1);

  const handleResize = () => {
    const computed = getComputedStyle(document.documentElement);
    const columns = computed.getPropertyValue("--grid-columns");

    setColumns(+columns);
  };

  onMount(() => {
    handleResize();
  });

  useWindowResize(handleResize);

  useKeypress("x", () => {
    setVisible(!visible());
  });

  return (
    <div
      class={cx(
        "pointer-events-none fixed inset-0 z-9999 h-screen w-[var(--screen-width)]",
        visible() ? "block" : "hidden",
      )}
    >
      <div class="px-margin-1 gap-gutter-1 grid-contain flex size-full">
        <For each={Array.from({ length: columns() }).fill(null)}>
          {(item, index) => <div class="size-full bg-[red]/10" />}
        </For>
      </div>
    </div>
  );
}
