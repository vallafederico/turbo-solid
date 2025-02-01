import { createEffect, createSignal } from "solid-js";

export default function Grid({}) {
  const num = Array.from({ length: 12 });

  const [visible, setVisible] = createSignal(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!e.shiftKey) return;

    if (e.key === "G") {
      setVisible(!visible());
    }
  };

  createEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
  });

  const styles =
    "gap-gutter fixed pointer-events-none left-0 top-0 z-10 flex h-[100vh] w-screen justify-between px-gx ";

  return (
    <div class={visible() ? styles : "invisible"}>
      {num.map((item) => {
        return <div class="grow bg-red-500 opacity-10"></div>;
      })}
    </div>
  );
}
