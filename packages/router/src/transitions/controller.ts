import { createSignal, type Accessor } from "solid-js";
import type {
  TransitionContextValue,
  TransitionDirection,
  TransitionPhase,
  TransitionRunner,
} from "../types";

const IDX_KEY = "__acme_idx";

class HistoryTracker {
  private current = 0;

  constructor() {
    if (typeof window === "undefined") return;
    const state = history.state as Record<string, unknown> | null;
    const existing = state?.[IDX_KEY];
    if (typeof existing === "number") {
      this.current = existing;
    } else {
      this.stamp(0, true);
    }
  }

  classifyPush(replace: boolean): TransitionDirection {
    if (replace) {
      this.stampNext(this.current, true);
      return "replace";
    }
    this.current += 1;
    this.stampNext(this.current, false);
    return "forward";
  }

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
      /* ignore */
    }
  }

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

export class TransitionController {
  private readonly history = new HistoryTracker();

  private readonly _direction = createSignal<TransitionDirection>("none");
  private readonly _progress = createSignal(0);
  private readonly _active = createSignal(false);

  private runners: Record<"outgoing" | "incoming", RunnerSet> = {
    outgoing: { enter: new Set(), leave: new Set() },
    incoming: { enter: new Set(), leave: new Set() },
  };

  readonly sharedRects = new Map<string, DOMRect>();

  /** Component-scoped callbacks drained before branch leave runners (page item anims). */
  private readonly beforeLeave = new Set<() => void | Promise<void>>();

  /** Incoming enter runners wait on this (out → in, not cross-fade). */
  private leaveDone: Promise<void> = Promise.resolve();
  private resolveLeaveDone: (() => void) | null = null;
  private leaveAttached = false;

  constructor(private readonly timeoutMs: number) {
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", this.onPopState, { passive: true });
    }
  }

  private popPending = false;
  private readonly onPopState = () => {
    this.popPending = true;
  };

  consumeCause(): "push" | "pop" {
    if (this.popPending) {
      this.popPending = false;
      return "pop";
    }
    return "push";
  }

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

  /** Runs before outgoing branch leave runners on each navigation. */
  registerBeforeLeave(fn: () => void | Promise<void>): () => void {
    this.beforeLeave.add(fn);
    return () => this.beforeLeave.delete(fn);
  }

  private async runBeforeLeave() {
    if (this.beforeLeave.size === 0) return;
    await Promise.all(
      [...this.beforeLeave].map((fn) => Promise.resolve(fn())),
    );
  }

  begin(cause: "push" | "pop", replace: boolean) {
    const dir =
      cause === "pop"
        ? this.history.classifyPop()
        : this.history.classifyPush(replace);
    this._direction[1](dir);
    this._progress[1](0);
    this._active[1](true);

    this.leaveAttached = false;
    this.leaveDone = new Promise<void>((res) => {
      this.resolveLeaveDone = res;
    });

    // No outgoing branch (e.g. in-place query swap) — don't block enter.
    queueMicrotask(() => {
      if (!this.leaveAttached) this.finishLeavePhase();
    });
  }

  private finishLeavePhase() {
    this.resolveLeaveDone?.();
    this.resolveLeaveDone = null;
  }

  end() {
    this._active[1](false);
    this._progress[1](1);
    this.sharedRects.clear();
    this.finishLeavePhase();
  }

  setProgress(p: number) {
    this._progress[1](Math.max(0, Math.min(1, p)));
  }

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

    const runTasks = async (el: HTMLElement) => {
      if (role === "outgoing") {
        await this.runBeforeLeave();
      }

      const kind = role === "outgoing" ? "leave" : "enter";
      const set = this.runners[role][kind];
      const tasks = [...set].map((fn) => {
        try {
          return Promise.resolve(fn(ctx, el));
        } catch (err) {
          console.error("[router] transition runner failed:", err);
          return Promise.resolve();
        }
      });

      const safety = new Promise<void>((res) =>
        setTimeout(res, this.timeoutMs),
      );

      const settle = () => {
        phase[1]("idle");
        resolveDone();
      };

      if (tasks.length === 0) {
        if (role === "outgoing") this.finishLeavePhase();
        if (typeof requestAnimationFrame !== "undefined") {
          requestAnimationFrame(settle);
        } else {
          settle();
        }
        return;
      }

      await Promise.race([
        Promise.all(tasks).then(() => undefined),
        safety,
      ]);
      if (role === "outgoing") this.finishLeavePhase();
      settle();
    };

    const attachElement = (el: HTMLElement) => {
      if (role === "outgoing") {
        this.leaveAttached = true;
        void runTasks(el);
        return;
      }

      // Incoming: wait for outgoing leave phase before enter (sequential).
      if (this._active[0]) {
        this.leaveDone.then(() => runTasks(el));
      } else {
        runTasks(el);
      }
    };

    return { ctx, attachElement };
  }
}
