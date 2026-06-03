import { createSignal, type Accessor } from "solid-js";
import type {
  TransitionContextValue,
  TransitionDirection,
  TransitionPhase,
  TransitionRunner,
  OutgoingLayer,
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

export interface LiveBranchRef {
  element: HTMLElement;
  ctx: TransitionContextValue;
  pageBeforeLeave: ReadonlySet<() => void | Promise<void>>;
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

  /** When true, incoming enter runs alongside outgoing leave (cross-fade). */
  private overlap = false;

  /** Incoming enter runners wait on this (sequential out → in). */
  private leaveDone: Promise<void> = Promise.resolve();
  private resolveLeaveDone: (() => void) | null = null;

  private liveBranch: LiveBranchRef | null = null;
  private leaveGateCompleted = false;
  private skipNavigationGate = false;
  private pendingOutgoing: OutgoingLayer | null = null;
  private snapshotOutgoingFn: ((key: string) => OutgoingLayer) | null = null;

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

  setLiveBranch(branch: LiveBranchRef | null) {
    this.liveBranch = branch;
  }

  getLiveBranch(): LiveBranchRef | null {
    return this.liveBranch;
  }

  markLeaveGateCompleted() {
    this.leaveGateCompleted = true;
  }

  consumeLeaveGateCompleted(): boolean {
    if (!this.leaveGateCompleted) return false;
    this.leaveGateCompleted = false;
    return true;
  }

  setPendingOutgoing(layer: OutgoingLayer) {
    this.pendingOutgoing = layer;
  }

  consumePendingOutgoing(): OutgoingLayer | null {
    const layer = this.pendingOutgoing;
    this.pendingOutgoing = null;
    return layer;
  }

  setSnapshotOutgoing(fn: ((key: string) => OutgoingLayer) | null) {
    this.snapshotOutgoingFn = fn;
  }

  get snapshotOutgoing(): ((key: string) => OutgoingLayer) | null {
    return this.snapshotOutgoingFn;
  }

  setSkipNavigationGate(skip: boolean) {
    this.skipNavigationGate = skip;
  }

  consumeSkipNavigationGate(): boolean {
    if (!this.skipNavigationGate) return false;
    return true;
  }

  register(
    role: "outgoing" | "incoming",
    kind: "enter" | "leave",
    fn: TransitionRunner,
  ): () => void {
    this.runners[role][kind].add(fn);
    return () => this.runners[role][kind].delete(fn);
  }

  /** Page item tweens — called from NavigationGate or outgoing branch leave. */
  async runPageBeforeLeave(
    hooks: ReadonlySet<() => void | Promise<void>>,
  ): Promise<void> {
    if (hooks.size === 0) return;
    await Promise.all([...hooks].map((fn) => Promise.resolve(fn())));
  }

  /** Layout leave runners only (after page item tweens). */
  async runBranchLeave(
    el: HTMLElement,
    ctx: TransitionContextValue,
  ): Promise<void> {
    const tasks = [...this.runners.outgoing.leave].map((fn) => {
      try {
        return Promise.resolve(fn(ctx, el));
      } catch (err) {
        console.error("[router] transition runner failed:", err);
        return Promise.resolve();
      }
    });

    if (tasks.length === 0) return;

    const safety = new Promise<void>((res) =>
      setTimeout(res, this.timeoutMs),
    );

    await Promise.race([
      Promise.all(tasks).then(() => undefined),
      safety,
    ]);
  }

  begin(cause: "push" | "pop", replace: boolean) {
    const dir =
      cause === "pop"
        ? this.history.classifyPop()
        : this.history.classifyPush(replace);
    this._direction[1](dir);
    this._progress[1](0);
    this._active[1](true);

    this.leaveDone = new Promise<void>((res) => {
      this.resolveLeaveDone = res;
    });
  }

  /** True when enter should run alongside leave (cross-fade presets). */
  isOverlap(): boolean {
    return this.overlap;
  }

  /** Resolves when outgoing leave finishes — used to mount the incoming branch. */
  whenLeaveReady(): Promise<void> {
    return this.leaveDone;
  }

  /** Call when this navigation has no outgoing branch to animate. */
  releaseLeaveGate(): void {
    this.finishLeavePhase();
  }

  finishLeavePhase() {
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

  /** Enable overlapping enter/leave (used by `useCrossFade` and similar presets). */
  setOverlap(enabled: boolean) {
    this.overlap = enabled;
  }

  createContext(
    role: "outgoing" | "incoming",
    path: string,
    pageBeforeLeave?: ReadonlySet<() => void | Promise<void>>,
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

    let leaveStarted = false;

    const runTasks = async (el: HTMLElement) => {
      if (role === "outgoing" && pageBeforeLeave?.size) {
        await this.runPageBeforeLeave(pageBeforeLeave);
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
        if (leaveStarted) return;
        leaveStarted = true;
        void runTasks(el);
        return;
      }

      // Incoming: wait for outgoing leave unless overlap mode is on.
      if (this._active[0] && !this.overlap) {
        this.leaveDone.then(() => runTasks(el));
      } else {
        void runTasks(el);
      }
    };

    return { ctx, attachElement };
  }
}
