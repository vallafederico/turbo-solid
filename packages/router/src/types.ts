import type { JSX } from "solid-js";

/** Direction inferred from history index deltas. */
export type TransitionDirection = "forward" | "backward" | "replace" | "none";

/** Lifecycle phase a given branch is in. */
export type TransitionPhase = "idle" | "entering" | "leaving";

/**
 * A transition context describes a single navigation in flight. Both the
 * outgoing and incoming branches receive their own context so an animation
 * hook can know which side it is on and coordinate against the other.
 */
export interface TransitionContextValue {
  /** Which side of the transition the consuming subtree belongs to. */
  readonly role: "outgoing" | "incoming";
  /** Current phase of this branch. */
  readonly phase: () => TransitionPhase;
  /** 0 → 1 progress of the *overall* transition (shared across both sides). */
  readonly progress: () => number;
  /** Navigation direction for directional/slide transitions. */
  readonly direction: () => TransitionDirection;
  /** The resolved pathname this branch represents. */
  readonly path: string;
  /**
   * Resolves once *this branch's* leave (outgoing) or enter (incoming)
   * animation has completed. The renderer awaits the outgoing side's
   * completion before unmounting it.
   */
  readonly done: Promise<void>;
}

/** A registered animation callback. Returns a promise or nothing. */
export type TransitionRunner = (
  ctx: TransitionContextValue,
  el: HTMLElement,
) => void | Promise<void>;

/** Options accepted by the top-level transition config. */
export interface TransitionConfig {
  /**
   * Default duration (ms) used as a fallback timeout so a missing/невыполненная
   * promise can never wedge the router. The branch is force-unmounted after
   * `max(resolved, timeoutMs)`.
   */
  timeoutMs?: number;
  /**
   * When true, the incoming branch is mounted but kept `visibility:hidden`
   * + `aria-hidden` until its enter runner begins, so SSR/first-paint is
   * unaffected and only client navigations dual-mount.
   */
  hideIncomingUntilEnter?: boolean;
}

export interface RouteBranch {
  /** Stable key — the matched leaf path. Identity drives mount/unmount. */
  key: string;
  /** The rendered element tree for this branch. */
  el: JSX.Element;
  /** Per-branch transition context. */
  ctx: TransitionContextValue;
}
