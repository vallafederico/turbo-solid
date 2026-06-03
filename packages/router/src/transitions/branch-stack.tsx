import {
  createSignal,
  createEffect,
  onCleanup,
  untrack,
  For,
  type JSX,
  type Accessor,
} from "solid-js";
import { isServer } from "solid-js/web";
import {
  BranchProviders,
  createBeforeLeaveRegistration,
} from "./branch-providers";
import type { TransitionController } from "./controller";
import type { TransitionContextValue, OutgoingLayer } from "../types";

export interface BranchStackProps {
  controller: TransitionController;
  branchKey: Accessor<string>;
  locationKey: Accessor<string>;
  children: () => JSX.Element;
  hideIncomingUntilEnter: boolean;
}

function triggerAttach(layer: {
  element: HTMLElement | null;
  attach: (el: HTMLElement) => void;
}) {
  if (layer.element) {
    queueMicrotask(() => layer.attach(layer.element!));
  }
}

function mountIncoming(
  props: BranchStackProps,
  branchKey: string,
  live: ReturnType<typeof createBeforeLeaveRegistration>,
  setLiveCtx: (ctx: TransitionContextValue) => void,
  setLiveAttach: (fn: (el: HTMLElement) => void) => void,
  liveElement: HTMLElement | null,
  notifyMount = true,
): TransitionContextValue {
  const { ctx, attachElement } = props.controller.createContext(
    "incoming",
    branchKey,
    live.hooks,
    { notifyMount },
  );
  setLiveCtx(ctx);
  setLiveAttach(() => attachElement);
  triggerAttach({ element: liveElement, attach: attachElement });
  return ctx;
}

function finishTransition(
  controller: TransitionController,
  ...done: Promise<void>[]
) {
  void Promise.all(done).then(() => controller.end());
}

/**
 * Live route under branch providers (hooks always work). Sequential navigations
 * leave via NavigationGate on this DOM, then swap content in place. Overlap
 * presets snapshot the outgoing page before navigate and stack it underneath.
 */
export function BranchStack(props: BranchStackProps): JSX.Element {
  const live = createBeforeLeaveRegistration();
  const [outgoing, setOutgoing] = createSignal<OutgoingLayer[]>([]);

  const { ctx: initialCtx, attachElement: initialAttach } =
    props.controller.createContext("incoming", props.branchKey(), live.hooks);

  const [liveCtx, setLiveCtx] = createSignal(initialCtx);
  const [liveAttach, setLiveAttach] = createSignal(initialAttach);
  let liveElement: HTMLElement | null = null;

  const syncLiveBranch = () => {
    if (!liveElement) {
      props.controller.setLiveBranch(null);
      return;
    }
    props.controller.setLiveBranch({
      element: liveElement,
      ctx: liveCtx(),
      pageBeforeLeave: live.hooks,
    });
  };

  const snapshotOutgoing = (key: string): OutgoingLayer | null => {
    if (!liveElement) return null;

    const { ctx, attachElement } = props.controller.createContext(
      "outgoing",
      key,
    );

    // Freeze the current live branch visually without re-running route hooks.
    // The clone is inert: strip ids so the live page keeps unique ids, and
    // hide it from a11y / pointer input.
    const content = liveElement.cloneNode(true) as HTMLElement;
    content.removeAttribute("id");
    content
      .querySelectorAll("[id]")
      .forEach((node) => node.removeAttribute("id"));
    content.setAttribute("aria-hidden", "true");
    content.removeAttribute("data-router-branch");

    // Pin the clone to the viewport at its current position so it stays put
    // while the incoming page resets scroll and animates over it.
    const box = liveElement.getBoundingClientRect();

    const layer: OutgoingLayer = {
      key,
      content,
      rect: { top: box.top, left: box.left, width: box.width },
      ctx,
      attach: attachElement,
      element: null,
    };

    ctx.done.then(() => {
      setOutgoing((list) => list.filter((x) => x !== layer));
    });

    return layer;
  };

  props.controller.setSnapshotOutgoing((key) => snapshotOutgoing(key as string));
  onCleanup(() => props.controller.setSnapshotOutgoing(null));

  createEffect((prev: { branchKey: string; locationKey: string } | undefined) => {
    if (isServer) return prev;

    const branchKey = props.branchKey();
    const locationKey = props.locationKey();

    if (prev === undefined) {
      return { branchKey, locationKey };
    }

    if (locationKey === prev.locationKey) return prev;

    // Same leaf, new query — refresh enter on live content without resetting
    // scroll or re-running mount side-effects.
    if (branchKey === prev.branchKey) {
      untrack(() =>
        mountIncoming(
          props,
          branchKey,
          live,
          setLiveCtx,
          setLiveAttach,
          liveElement,
          false,
        ),
      );
      return { branchKey, locationKey };
    }

    // Sequential push: gate already animated the live page out.
    if (props.controller.consumeLeaveGateCompleted()) {
      untrack(() => {
        const ctx = mountIncoming(
          props,
          branchKey,
          live,
          setLiveCtx,
          setLiveAttach,
          liveElement,
        );
        finishTransition(props.controller, ctx.done);
      });
      return { branchKey, locationKey };
    }

    // Overlap push: gate snapshotted the outgoing page before navigate.
    const pending = props.controller.consumePendingOutgoing();
    if (pending) {
      untrack(() => {
        // Drop stale layers (e.g. fast re-navigation) and keep the latest one.
        setOutgoing([pending]);
        const incomingCtx = mountIncoming(
          props,
          branchKey,
          live,
          setLiveCtx,
          setLiveAttach,
          liveElement,
        );
        finishTransition(props.controller, pending.ctx.done, incomingCtx.done);
      });
      return { branchKey, locationKey };
    }

    // Back/forward — update live route but preserve native scroll restoration.
    untrack(() =>
      mountIncoming(
        props,
        branchKey,
        live,
        setLiveCtx,
        setLiveAttach,
        liveElement,
        false,
      ),
    );

    return { branchKey, locationKey };
  });

  onCleanup(() => {
    props.controller.setLiveBranch(null);
  });

  return (
    <div data-router-stack style={{ display: "grid" }}>
      <For each={outgoing()}>
        {(layer) => (
          <div
            data-router-branch="outgoing"
            aria-hidden="true"
            style={{
              position: "fixed",
              top: `${layer.rect.top}px`,
              left: `${layer.rect.left}px`,
              width: `${layer.rect.width}px`,
              "pointer-events": "none",
              "z-index": 0,
            }}
            ref={(el: HTMLElement) => {
              layer.element = el;
              if (layer.content.parentElement !== el) {
                el.replaceChildren(layer.content);
              }
              triggerAttach(layer);
            }}
          >
            {/* frozen content is injected in ref */}
          </div>
        )}
      </For>

      <BranchProviders ctx={liveCtx} registration={live.registration}>
        <div
          data-router-branch={liveCtx().role}
          style={{
            "grid-area": "1 / 1",
            "z-index": props.controller.isActive() ? 1 : undefined,
            "min-height": "100svh",
            visibility:
              props.hideIncomingUntilEnter &&
              props.controller.isActive() &&
              liveCtx().phase() === "entering"
                ? "hidden"
                : undefined,
          }}
          ref={(el: HTMLElement) => {
            liveElement = el;
            syncLiveBranch();
            triggerAttach({ element: el, attach: liveAttach() });
          }}
        >
          {props.children()}
        </div>
      </BranchProviders>
    </div>
  );
}
