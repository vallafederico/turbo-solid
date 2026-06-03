import { createSignal, type Accessor } from "solid-js";
import type {
  TransitionContextValue,
  TransitionDirection,
  TransitionPhase,
  TransitionRunner,
} from "../types";

/**
 * Tracks browser history position so we can label a navigation
 * forward / backward. `history.state` is owned by @solidjs/router, so we keep
 * our own monotonic counter in a parallel field that survives reloads via
 * sessionStorage (best-effort; falls back to in-memory).
 */
const IDX_KEY = "__acme_idx";

/**
 * Direction is derived by stamping a monotonic index into `history.state`
 * under our own key (alongside whatever @solidjs/router stores). For
 * router-driven (push) navigations we increment and stamp the new entry. For
 * native back/forward (popstate) the browser restores the entry we previously
 * stamped, so reading its index and comparing to our last-seen value tells us
 * the direction reliably — no guessing.
 */
class HistoryTracker {
  private current = 0;

  constructor() {
    if (typeof window === "undefined") return;
    const state = history.state as Record<string, unknown> | null;
    const existing = state?.[IDX_KEY];
    if (typeof existing === "number") {
      this.current = existing;
    } else {
      // Stamp the initial entry without creating a new one.
      this.stamp(0, /* replace */ true);
    }
  }

  /**
   * Classify a router-initiated navigation. `replace` means same stack depth.
   * We stamp the *next* entry's index right after the router pushes it; since
   * we can't see the new state synchronously here, we increment our counter
   * and let the router's push carry it via a microtask stamp.
   */
  classifyPush(replace: boolean): TransitionDirection {
    if (replace) {
      this.stampNext(this.current, true);
      return "replace";
    }
    this.current += 1;
    this.stampNext(this.current, false);
    return "forward";
  }

  /** Classify a native popstate by reading the restored entry's index. */
  classifyPop(): TransitionDirection {
    if (typeof window === "undefined") return "none";
    const state = history.state as Record<string, unknown> | null;
    const restored = state?.[IDX_KEY];
    const to = typeof restored === "number" ? restored : this.current - 1;
    const dir =
      to > this.current ? "forward" : to < this.current ? "backward" : "none";
    this.current = to;
    return dir;
  }

  private stamp(idx: number, replace: boolean) {
    if (typeof window === "undefined") return;
    const state = { ...(history.state ?? {}), [IDX_KEY]: idx };
    try {
      if (replace) history.replaceState(state, "");
      else history.pushState(state, "");
    } catch {
      /* cross-origin or disabled history — direction falls back to forward */
    }
  }

  /**
   * The router performs the actual pushState; we only need to annotate the
   * resulting entry. Defer to a microtask so it runs after the router's push.
   */
  private stampNext(idx: number, replace: boolean) {
    if (typeof window === "undefined") return;
    queueMicrotask(() => {
      const state = { ...(history.state ?? {}), [IDX_KEY]: idx };
      try {
        history.replaceState(state, "");
      } catch {
        /* ignore */
      }
      void replace;
    });
  }
}

interface RunnerSet {
  enter: Set<TransitionRunner>;
  leave: Set<TransitionRunner>;
}

/**
 * One controller per Router instance. Holds the global progress signal,
 * direction, the registry of animation runners, and builds per-branch
 * transition contexts whose `done` promise the renderer awaits.
 */
export class TransitionController {
  private readonly history = new HistoryTracker();

  private readonly _direction = createSignal<TransitionDirection>("none");
  private readonly _progress = createSignal(0);
  private readonly _active = createSignal(false);

  /** Runners are keyed by branch role so an outgoing page's onLeave and an
   * incoming page's onEnter stay isolated even though both are mounted. */
  private runners: Record<"outgoing" | "incoming", RunnerSet> = {
    outgoing: { enter: new Set(), leave: new Set() },
    incoming: { enter: new Set(), leave: new Set() },
  };

  /** FLIP shared-element rects captured at leave-time, keyed by shared id. */
  readonly sharedRects = new Map<string, DOMRect>();

  constructor(private readonly timeoutMs: number) {
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", this.onPopState, { passive: true });
    }
  }

  /** True for one navigation tick when the change originated from back/forward. */
  private popPending = false;
  private readonly onPopState = () => {
    this.popPending = true;
  };

  /** Consume the popstate flag; returns the cause for the imminent navigation. */
  consumeCause(): "push" | "pop" {
    if (this.popPending) {
      this.popPending = false;
      return "pop";
    }
    return "push";
  }

  /** Detach listeners (call from the Router's onCleanup). */
  dispose() {
    if (typeof window !== "undefined") {
      window.removeEventListener("popstate", this.onPopState);
    }
  }

  get direction(): Accessor<TransitionDirection> {
    return this._direction[0];
  }
  get progress(): Accessor<number> {
    return this._progress[0];
  }
  get isActive(): Accessor<boolean> {
    return this._active[0];
  }

  register(
    role: "outgoing" | "incoming",
    kind: "enter" | "leave",
    fn: TransitionRunner,
  ): () => void {
    this.runners[role][kind].add(fn);
    return () => this.runners[role][kind].delete(fn);
  }

  /**
   * Called by the renderer when a navigation is detected.
   * `cause` lets us pick the right classifier: a popstate reads the restored
   * history index, a push increments and stamps a new one.
   */
  begin(cause: "push" | "pop", replace: boolean) {
    const dir =
      cause === "pop"
        ? this.history.classifyPop()
        : this.history.classifyPush(replace);
    this._direction[1](dir);
    this._progress[1](0);
    this._active[1](true);
  }

  end() {
    this._active[1](false);
    this._progress[1](1);
    this.sharedRects.clear();
  }

  /** Drive overall progress (renderer ticks this from a rAF loop or GSAP). */
  setProgress(p: number) {
    this._progress[1](Math.max(0, Math.min(1, p)));
  }

  /**
   * Build a branch context and a `done` promise that resolves when every
   * registered runner for the relevant side settles — or the safety timeout
   * fires, whichever comes first. The renderer attaches the real element via
   * `attachElement` before runners fire.
   */
  createContext(
    role: "outgoing" | "incoming",
    path: string,
  ): {
    ctx: TransitionContextValue;
    attachElement: (el: HTMLElement) => void;
  } {
    const phase = createSignal<TransitionPhase>(
      role === "outgoing" ? "leaving" : "entering",
    );

    let resolveDone!: () => void;
    const done = new Promise<void>((res) => (resolveDone = res));

    const ctx: TransitionContextValue = {
      role,
      phase: phase[0],
      progress: this._progress[0],
      direction: this._direction[0],
      path,
      done,
    };

    const attachElement = (el: HTMLElement) => {
      const kind = role === "outgoing" ? "leave" : "enter";
      const set = this.runners[role][kind];
      const tasks = [...set].map((fn) => {
        try {
          return Promise.resolve(fn(ctx, el));
        } catch (err) {
          // A throwing runner must never wedge navigation.
          console.error("[router] transition runner failed:", err);
          return Promise.resolve();
        }
      });

      const safety = new Promise<void>((res) =>
        setTimeout(res, this.timeoutMs),
      );

      Promise.race([Promise.all(tasks).then(() => undefined), safety]).then(
        () => {
          phase[1]("idle");
          resolveDone();
        },
      );

      // If nothing registered a runner, resolve on the next frame so a swap
      // with no animation is still instant rather than waiting the timeout.
      if (tasks.length === 0) {
        if (typeof requestAnimationFrame !== "undefined") {
          requestAnimationFrame(() => {
            phase[1]("idle");
            resolveDone();
          });
        } else {
          phase[1]("idle");
          resolveDone();
        }
      }
    };

    return { ctx, attachElement };
  }
}
