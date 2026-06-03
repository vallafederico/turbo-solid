import { useCrossFade, useRouteTransition } from "@acme/router";
import { createMemo } from "solid-js";

/** Live branch metadata — visible during dual-mount transitions. */
export default function TransitionBadge() {
  const t = useRouteTransition();

  const label = createMemo(() => {
    const role = t.role === "outgoing" ? "Leaving" : "Entering";
    return `${role} · ${t.phase()} · ${t.direction()}`;
  });

  return (
    <div
      class="pointer-events-none fixed right-4 bottom-4 z-[200] rounded-lg border border-white/30 bg-black/70 px-4 py-3 font-mono text-xs text-white shadow-lg backdrop-blur-sm"
      aria-live="polite"
    >
      <p class="mb-1 text-[10px] uppercase tracking-widest text-white/50">
        Branch
      </p>
      <p class="text-sm font-semibold">{label()}</p>
      <p class="mt-1 max-w-[14rem] truncate text-[10px] text-white/60">
        {t.path}
      </p>
    </div>
  );
}
