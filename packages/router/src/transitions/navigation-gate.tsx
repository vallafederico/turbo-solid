import {
  useBeforeLeave,
  useCurrentMatches,
  useNavigate,
  usePreloadRoute,
  type BeforeLeaveEventArgs,
} from "@solidjs/router";
import { useController } from "./context";
import { getBranchKey, isSameLeafNavigation } from "./same-leaf";

/**
 * Intercepts link / programmatic navigations so the current page can animate
 * out (sequential) or be snapshotted (overlap) before the route changes — the
 * same model as the old `useBeforeLeave` page-transition hook.
 *
 * Same-leaf query changes bypass the gate so BranchStack can swap content in
 * place with no transition.
 *
 * Browser back/forward (popstate) cannot be blocked here, so those swap
 * instantly and are handled by `BranchStack`.
 */
export function NavigationGate(): null {
  const controller = useController();
  const navigate = useNavigate();
  const preload = usePreloadRoute();
  const matches = useCurrentMatches();

  useBeforeLeave(async (e: BeforeLeaveEventArgs) => {
    if (typeof e.to === "number") return;
    // The gate re-issues navigation itself; let that one through untouched.
    if (controller.consumeGateSkip(e.to)) return;

    // Same route leaf, new query — instant swap (no leave/enter).
    const branchKey = getBranchKey(matches(), e.from.pathname);
    if (isSameLeafNavigation(e.from, e.to, branchKey)) return;

    const live = controller.getLiveBranch();
    if (!live?.element) return;

    e.preventDefault();

    const replace = Boolean(e.options?.replace);
    controller.begin(replace ? "replace" : "forward");

    if (controller.hasCustomTransition()) {
      // Snapshot synchronously while the live DOM still shows the outgoing page.
      const snapshot = controller.snapshotOutgoing?.(live.ctx.path);
      if (!snapshot) {
        e.retry(true);
        return;
      }
      controller.setPendingOutgoing(snapshot);
    } else {
      await controller.runPageBeforeLeave(live.pageBeforeLeave);
      await controller.runBranchLeave(live.element, live.ctx);
      controller.finishLeavePhase();
      controller.markLeaveGateCompleted();
    }

    if (typeof window !== "undefined") {
      preload(e.to, { preloadData: true });
      await new Promise<void>((resolve) => queueMicrotask(resolve));
    }

    controller.armGateSkip(e.to);
    navigate(e.to, {
      ...e.options,
      resolve: false,
      scroll: false,
    });
  });

  return null;
}
