import { createSignal, type Accessor } from "solid-js";
import type {
  TransitionContextValue,
  TransitionDirection,
  TransitionPhase,
  TransitionRunner,
  OutgoingLayer,
} from "../types";

interface RunnerSet {
  enter: Set<TransitionRunner>;
  leave: Set<TransitionRunner>;
}

export interface LiveBranchRef {
  element: HTMLElement;
  ctx: TransitionContextValue;
  pageBeforeLeave: ReadonlySet<() => void | Promise<void>>;
}

/** Extra ms added to a preset's own duration before the safety timeout fires. */
const SAFETY_BUFFER_MS = 500;

export class TransitionController {
  private readonly _direction = createSignal<TransitionDirection>("none");
  private readonly _progress = createSignal(0);
  private readonly _active = createSignal(false);

  private runners: Record<"outgoing" | "incoming", RunnerSet> = {
    outgoing: { enter: new Set(), leave: new Set() },
    incoming: { enter: new Set(), leave: new Set() },
  };

  readonly sharedRects = new Map<string, DOMRect>();

  /** Incoming enter runners wait on this (sequential out → in). */
  private leaveDone: Promise<void> = Promise.resolve();
  private resolveLeaveDone: (() => void) | null = null;

  private liveBranch: LiveBranchRef | null = null;
  private leaveGateCompleted = false;
  /** URL the gate is about to re-issue; that navigation bypasses the gate once. */
  private skipTarget: string | null = null;
  private pendingOutgoing: OutgoingLayer | null = null;
  private snapshotOutgoingFn: ((key: string) => OutgoingLayer | null) | null =
    null;

  /** Custom branch runners (cross-fade / slide / cover) owning the transition. */
  private overlapPreset: {
    leave: TransitionRunner;
    enter: TransitionRunner;
    durationMs: number;
  } | null = null;

  private idleResolve: (() => void) | null = null;
  private whenIdle: Promise<void> = Promise.resolve();

  private readonly incomingMount = new Set<
    (ctx: TransitionContextValue, el: HTMLElement) => void
  >();

  constructor(private readonly timeoutMs: number) {}

  dispose() {
    /* reserved for future listeners */
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

  setSnapshotOutgoing(fn: ((key: string) => OutgoingLayer | null) | null) {
    this.snapshotOutgoingFn = fn;
  }

  get snapshotOutgoing(): ((key: string) => OutgoingLayer | null) | null {
    return this.snapshotOutgoingFn;
  }

  /** Arm a one-shot bypass for the gate's own re-issued navigation. */
  armGateSkip(to: string) {
    this.skipTarget = to;
  }

  /** True (and disarms) when `to` matches the armed gate-skip target. */
  consumeGateSkip(to: string | number): boolean {
    if (typeof to === "string" && this.skipTarget === to) {
      this.skipTarget = null;
      return true;
    }
    return false;
  }

  /** Register custom branch enter/leave (survives layout unmount mid-transition). */
  setOverlapPreset(
    leave: TransitionRunner,
    enter: TransitionRunner,
    durationMs = 0,
  ): void {
    this.overlapPreset = { leave, enter, durationMs };
  }

  async clearOverlapPreset(): Promise<void> {
    if (this._active[0]) await this.whenIdle;
    this.overlapPreset = null;
  }

  /** Runs when an incoming branch attaches for a real transition (scroll restore, etc.). */
  registerIncomingMount(
    fn: (ctx: TransitionContextValue, el: HTMLElement) => void,
  ): () => void {
    this.incomingMount.add(fn);
    return () => this.incomingMount.delete(fn);
  }

  register(
    role: "outgoing" | "incoming",
    kind: "enter" | "leave",
    fn: TransitionRunner,
  ): () => void {
    this.runners[role][kind].add(fn);
    return () => this.runners[role][kind].delete(fn);
  }

  /** Page item tweens (`beforeLeave` / `onPageLeave`) drained before branch leave. */
  async runPageBeforeLeave(
    hooks: ReadonlySet<() => void | Promise<void>>,
  ): Promise<void> {
    if (hooks.size === 0) return;
    await Promise.all([...hooks].map((fn) => Promise.resolve(fn())));
  }

  /** Layout leave runners (after page item tweens). Skipped when a custom preset owns the transition. */
  async runBranchLeave(
    el: HTMLElement,
    ctx: TransitionContextValue,
  ): Promise<void> {
    if (this.hasCustomTransition()) return;
    const tasks = [...this.runners.outgoing.leave].map((fn) =>
      this.safeRun(fn, ctx, el),
    );
    if (tasks.length === 0) return;
    await this.raceSafety(tasks);
  }

  begin(direction: TransitionDirection) {
    this._direction[1](direction);
    this._progress[1](0);
    this._active[1](true);

    this.leaveDone = new Promise<void>((res) => {
      this.resolveLeaveDone = res;
    });
    this.whenIdle = new Promise<void>((res) => {
      this.idleResolve = res;
    });
  }

  /** True when a layout-level custom preset (`useCoverSlideUp`, etc.) owns the transition. */
  hasCustomTransition(): boolean {
    return this.overlapPreset !== null;
  }

  finishLeavePhase() {
    this.resolveLeaveDone?.();
    this.resolveLeaveDone = null;
  }

  end() {
    if (this.liveBranch?.element) {
      this.resetBranchElement(this.liveBranch.element);
    }
    this._active[1](false);
    this._progress[1](1);
    this.sharedRects.clear();
    this.finishLeavePhase();
    this.idleResolve?.();
    this.idleResolve = null;
  }

  /** Reset branch wrapper styles after a custom preset transition. */
  resetBranchElement(el: HTMLElement) {
    el.style.opacity = "";
    el.style.transform = "";
  }

  private safeRun(
    fn: TransitionRunner,
    ctx: TransitionContextValue,
    el: HTMLElement,
  ): Promise<void> {
    try {
      return Promise.resolve(fn(ctx, el));
    } catch (err) {
      console.error("[router] transition runner failed:", err);
      return Promise.resolve();
    }
  }

  /** Race the real work against a safety timeout sized to the active transition. */
  private raceSafety(tasks: Promise<unknown>[]): Promise<void> {
    const presetMs = this.overlapPreset?.durationMs ?? 0;
    const safetyMs = Math.max(this.timeoutMs, presetMs + SAFETY_BUFFER_MS);
    const safety = new Promise<void>((res) => setTimeout(res, safetyMs));
    return Promise.race([
      Promise.all(tasks).then(() => undefined),
      safety,
    ]);
  }

  createContext(
    role: "outgoing" | "incoming",
    path: string,
    pageBeforeLeave?: ReadonlySet<() => void | Promise<void>>,
    options?: { notifyMount?: boolean },
  ): {
    ctx: TransitionContextValue;
    attachElement: (el: HTMLElement) => void;
  } {
    // Mount side-effects (scroll restore, etc.) only fire for genuine route
    // transitions — not query-only swaps or browser back/forward.
    const notifyMount = options?.notifyMount ?? true;
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
      // Query-only / same-leaf swaps never call begin() — skip all runners.
      if (!this._active[0]) {
        if (role === "incoming") {
          this.resetBranchElement(el);
          el.style.opacity = "1";
        }
        phase[1]("idle");
        resolveDone();
        return;
      }

      const custom = this.hasCustomTransition();

      if (role === "outgoing" && pageBeforeLeave?.size && !custom) {
        await this.runPageBeforeLeave(pageBeforeLeave);
      }

      if (role === "incoming" && notifyMount) {
        for (const fn of this.incomingMount) fn(ctx, el);
      }

      const kind = role === "outgoing" ? "leave" : "enter";
      const tasks = custom
        ? [
            this.safeRun(
              role === "outgoing"
                ? this.overlapPreset!.leave
                : this.overlapPreset!.enter,
              ctx,
              el,
            ),
          ]
        : [...this.runners[role][kind]].map((fn) => this.safeRun(fn, ctx, el));

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

      await this.raceSafety(tasks);
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

      // Incoming: in sequential mode the gate has already resolved leaveDone,
      // so this ordering guard runs enter on the next microtask. Overlap mode
      // runs enter immediately, parallel with the outgoing layer.
      if (this._active[0] && !this.hasCustomTransition()) {
        void this.leaveDone.then(() => runTasks(el));
      } else {
        void runTasks(el);
      }
    };

    return { ctx, attachElement };
  }
}
