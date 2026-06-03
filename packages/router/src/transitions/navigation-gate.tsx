import {
  useBeforeLeave,
  useNavigate,
  usePreloadRoute,
  type BeforeLeaveEventArgs,
} from "@solidjs/router";
import { useController } from "./context";

/**
 * Intercepts navigations so the current page can animate out on the live DOM
 * before the route changes — the same model as the old page-transition hook.
 */
export function NavigationGate(): null {
  const controller = useController();
  const navigate = useNavigate();
  const preload = usePreloadRoute();

  useBeforeLeave(async (e: BeforeLeaveEventArgs) => {
    if (typeof e.to === "number") return;
    if (controller.consumeSkipNavigationGate()) return;

    const live = controller.getLiveBranch();
    if (!live?.element) return;

    e.preventDefault();

    const overlap = controller.hasCustomTransition();
    const outgoingKey = live.ctx.path;

    if (overlap) {
      controller.begin("push", Boolean(e.options?.replace));
      // Snapshot synchronously while children() still renders the outgoing page.
      const snapshot = controller.snapshotOutgoing?.(outgoingKey);
      if (!snapshot) {
        e.retry(true);
        return;
      }
      controller.setPendingOutgoing(snapshot);
    } else {
      controller.begin("push", Boolean(e.options?.replace));
      await controller.runPageBeforeLeave(live.pageBeforeLeave);
      await controller.runBranchLeave(live.element, live.ctx);
      controller.finishLeavePhase();
      controller.markLeaveGateCompleted();
    }

    if (typeof e.to === "string" && typeof window !== "undefined") {
      preload(e.to, { preloadData: true });
      await new Promise<void>((resolve) => queueMicrotask(resolve));
    }

    controller.setSkipNavigationGate(true);
    navigate(e.to, {
      ...e.options,
      resolve: false,
      scroll: false,
    });
    controller.setSkipNavigationGate(false);
  });

  return null;
}
