import { Gl } from "../gl";

function resolveTarget(attachTo: object | null | undefined) {
  return (attachTo ?? Gl.scene) as { add?: (o: unknown) => void } | undefined;
}

/**
 * `Gl.start()` may not have set `Gl.scene` yet (e.g. a DOM quad’s effect runs
 * before the parent `<Canvas />` has mounted the GL, especially in React’s effect order).
 * Polls with rAF until `add` exists, then calls `run`.
 *
 * @returns cancel — call on unmount to stop polling.
 */
export function runWhenAttachTargetReady(
  attachTo: object | null | undefined,
  run: (target: { add: (o: unknown) => void }) => void,
  onTimeout?: () => void,
  maxWaitMs = 10_000,
): () => void {
  let raf = 0;
  let done = false;
  const t0 = typeof performance !== "undefined" ? performance.now() : 0;

  const stop = () => {
    done = true;
    cancelAnimationFrame(raf);
  };

  const tick = () => {
    if (done) return;
    if (
      typeof performance !== "undefined" &&
      performance.now() - t0 > maxWaitMs
    ) {
      onTimeout?.();
      return;
    }
    const target = resolveTarget(attachTo);
    if (target && typeof target.add === "function") {
      run(target as { add: (o: unknown) => void });
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  tick();
  return stop;
}
