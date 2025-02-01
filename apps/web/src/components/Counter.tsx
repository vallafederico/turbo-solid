import { createEffect, createSignal } from "solid-js";

export default function Counter() {
  const [count, setCount] = createSignal(0);

  createEffect(() => {
    // console.log("webgl alive (store)", webgl.alive);
  });

  return (
    <button class="" onClick={() => setCount(count() + 1)}>
      Clicks: {count()}
    </button>
  );
}
