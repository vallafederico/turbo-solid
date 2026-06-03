import {
  createSignal,
  createEffect,
  createRoot,
  onCleanup,
  untrack,
  getOwner,
  For,
  type JSX,
  type Accessor,
  type Owner,
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
) {
  const { ctx, attachElement } = props.controller.createContext(
    "incoming",
    branchKey,
    live.hooks,
  );
  setLiveCtx(ctx);
  setLiveAttach(() => attachElement);
  triggerAttach({ element: liveElement, attach: attachElement });
}

/**
 * Live route under branch providers (hooks always work). Sequential navigations
 * leave via NavigationGate on this DOM, then swap content in place. Overlap
 * presets snapshot the outgoing page before navigate and stack it underneath.
 */
export function BranchStack(props: BranchStackProps): JSX.Element {
  const parentOwner = getOwner();

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

  const snapshotOutgoing = (key: string): OutgoingLayer => {
    const snap = createBeforeLeaveRegistration();
    for (const fn of live.hooks) snap.hooks.add(fn);

    const { ctx, attachElement } = props.controller.createContext(
      "outgoing",
      key,
      snap.hooks,
    );

    let dispose!: () => void;
    let nodes!: JSX.Element;

    createRoot((d) => {
      dispose = d;
      nodes = (
        <BranchProviders ctx={() => ctx} registration={snap.registration}>
          {untrack(props.children) as JSX.Element}
        </BranchProviders>
      );
    }, parentOwner as Owner);

    const layer: OutgoingLayer = {
      key,
      nodes,
      pageBeforeLeave: snap.hooks,
      ctx,
      attach: attachElement,
      element: null,
      dispose,
    };

    ctx.done.then(() => {
      layer.dispose();
      setOutgoing((list) => list.filter((x) => x !== layer));
    });

    return layer;
  };

  props.controller.setSnapshotOutgoing((key) =>
    snapshotOutgoing(key as string),
  );
  onCleanup(() => props.controller.setSnapshotOutgoing(null));

  createEffect((prev: { branchKey: string; locationKey: string } | undefined) => {
    if (isServer) return prev;

    const branchKey = props.branchKey();
    const locationKey = props.locationKey();

    if (prev === undefined) {
      return { branchKey, locationKey };
    }

    if (locationKey === prev.locationKey) return prev;

    // Same leaf, new query — refresh enter on live content.
    if (branchKey === prev.branchKey) {
      untrack(() =>
        mountIncoming(
          props,
          branchKey,
          live,
          setLiveCtx,
          setLiveAttach,
          liveElement,
        ),
      );
      return { branchKey, locationKey };
    }

    // Sequential push: gate already animated the live page out.
    if (props.controller.consumeLeaveGateCompleted()) {
      untrack(() =>
        mountIncoming(
          props,
          branchKey,
          live,
          setLiveCtx,
          setLiveAttach,
          liveElement,
        ),
      );
      return { branchKey, locationKey };
    }

    // Overlap push: gate snapshotted the outgoing page before navigate.
    const pending = props.controller.consumePendingOutgoing() as
      | OutgoingLayer
      | null;
    if (pending) {
      untrack(() => {
        setOutgoing((list) => [...list, pending]);
        triggerAttach(pending);
        mountIncoming(
          props,
          branchKey,
          live,
          setLiveCtx,
          setLiveAttach,
          liveElement,
        );
      });
      return { branchKey, locationKey };
    }

    // Back/forward — update live route; leave animations are best-effort.
    untrack(() =>
      mountIncoming(
        props,
        branchKey,
        live,
        setLiveCtx,
        setLiveAttach,
        liveElement,
      ),
    );

    return { branchKey, locationKey };
  });

  onCleanup(() => {
    for (const layer of outgoing()) layer.dispose();
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
              "grid-area": "1 / 1",
              "pointer-events": "none",
            }}
            ref={(el: HTMLElement) => {
              layer.element = el;
              triggerAttach(layer);
            }}
          >
            {layer.nodes}
          </div>
        )}
      </For>

      <BranchProviders ctx={liveCtx} registration={live.registration}>
        <div
          data-router-branch="live"
          style={{
            "grid-area": "1 / 1",
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
