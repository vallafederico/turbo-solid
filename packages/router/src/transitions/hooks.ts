import { onCleanup, onMount, createMemo } from "solid-js";
import { useController, useBranch, useBranchRegistration } from "./context";
import type {
  TransitionContextValue,
  TransitionDirection,
  TransitionRunner,
} from "../types";

/**
 * Read the current branch's transition state. Inside a page component this
 * resolves to *that page's* context — outgoing or incoming — so the same
 * component can drive both its leave and enter animation from one place.
 *
 * @example
 * const t = useRouteTransition();
 * createEffect(() => { el.style.opacity = String(1 - t.progress()); });
 */
export function useRouteTransition(): TransitionContextValue {
  const branch = useBranch();
  const controller = useController();
  if (branch) return branch;

  // No branch context (e.g. used in the persistent layout): synthesize a
  // read-only view backed by the controller so layout chrome can still react.
  return {
    role: "incoming",
    phase: () => (controller.isActive() ? "entering" : "idle"),
    progress: controller.progress,
    direction: controller.direction,
    path: typeof location !== "undefined" ? location.pathname : "",
    done: Promise.resolve(),
  };
}

/**
 * Register an enter animation for the page this hook is called in. The runner
 * receives the branch context and the page's root element, and may return a
 * promise; the router holds coordination open until it resolves.
 *
 * Replaces the old global `setOutTransition` registry — registration is now
 * scoped to the component and auto-cleaned on unmount.
 */
export function onEnter(fn: TransitionRunner): void {
  const controller = useController();
  const unregister = controller.register("incoming", "enter", fn);
  onCleanup(unregister);
}

/** Register a leave animation for the page this hook is called in. */
export function onLeave(fn: TransitionRunner): void {
  const controller = useController();
  const unregister = controller.register("outgoing", "leave", fn);
  onCleanup(unregister);
}

/**
 * Register a callback that runs before branch leave animations on navigation
 * (e.g. page-scoped item tweens). Auto-cleaned on unmount.
 */
export function beforeLeave(fn: () => void | Promise<void>): void {
  const reg = useBranchRegistration();
  if (!reg) return;
  onCleanup(reg.registerBeforeLeave(fn));
}

/** Reactive navigation direction — drive directional/slide transitions. */
export function useTransitionDirection(): () => TransitionDirection {
  return useController().direction;
}

export interface SharedElementHandle {
  /** Attach to the element's `ref`. */
  readonly ref: (el: HTMLElement) => void;
}

/**
 * Mark an element as shared across the transition. On leave, its bounding rect
 * is captured under `id`; on enter, the matching element reads that rect and
 * the consumer can FLIP-animate from the old position to the new one.
 *
 * The hook only records geometry and exposes the previous rect — the actual
 * tween is left to the caller (via onEnter) so any easing library works.
 *
 * @example
 * const hero = useSharedElement("product-image");
 * onEnter((_, el) => {
 *   const prev = hero.previousRect();
 *   if (!prev) return;
 *   const now = el.getBoundingClientRect();
 *   // invert + play with your animation lib of choice
 * });
 */
export function useSharedElement(id: string): {
  ref: (el: HTMLElement) => void;
  previousRect: () => DOMRect | undefined;
} {
  const controller = useController();
  const branch = useBranch();
  let node: HTMLElement | undefined;

  const ref = (el: HTMLElement) => {
    node = el;
  };

  // Outgoing branch: capture geometry the moment leave begins.
  if (branch?.role === "outgoing") {
    onMount(() => {
      if (node) controller.sharedRects.set(id, node.getBoundingClientRect());
    });
    onCleanup(() => {
      // Capture again at unmount in case layout shifted during leave.
      if (node) controller.sharedRects.set(id, node.getBoundingClientRect());
    });
  }

  const previousRect = createMemo(() => controller.sharedRects.get(id));
  return { ref, previousRect };
}
