import {
  createSignal,
  createEffect,
  createRoot,
  onCleanup,
  onMount,
  untrack,
  getOwner,
  For,
  type JSX,
  type Accessor,
  type Owner,
} from "solid-js";
import { isServer } from "solid-js/web";
import { BranchContext } from "./context";
import type { TransitionController } from "./controller";
import type { TransitionContextValue } from "../types";

interface MountedBranch {
  key: string;
  ctx: Accessor<TransitionContextValue>;
  setCtx: (c: TransitionContextValue) => void;
  attach: (el: HTMLElement) => void;
  setAttach: (fn: (el: HTMLElement) => void) => void;
  element: HTMLElement | null;
  nodes: JSX.Element;
  dispose: () => void;
  retiring: Accessor<boolean>;
  setRetiring: (v: boolean) => void;
}

export interface BranchStackProps {
  controller: TransitionController;
  branchKey: Accessor<string>;
  locationKey: Accessor<string>;
  children: () => JSX.Element;
  hideIncomingUntilEnter: boolean;
}

function triggerAttach(branch: MountedBranch) {
  if (branch.element) {
    queueMicrotask(() => branch.attach(branch.element!));
  }
}

/**
 * SSR/hydration: passthrough live route output.
 * After mount: bootstrap a branch so the first navigation can leave the current page.
 * Navigations: dual-mount outgoing + incoming with sequential out → in runners.
 */
export function BranchStack(props: BranchStackProps): JSX.Element {
  const [branches, setBranches] = createSignal<MountedBranch[]>([]);
  const parentOwner = getOwner();

  const makeBranch = (
    key: string,
    role: "outgoing" | "incoming",
  ): MountedBranch => {
    const { ctx: initialCtx, attachElement } = props.controller.createContext(
      role,
      key,
    );

    const [ctx, setCtx] = createSignal(initialCtx);
    const [attach, setAttach] = createSignal(attachElement);
    const [retiring, setRetiring] = createSignal(role === "outgoing");

    let dispose!: () => void;
    let nodes!: JSX.Element;
    createRoot((d) => {
      dispose = d;
      nodes = untrack(() => props.children()) as JSX.Element;
    }, parentOwner as Owner);

    const branch: MountedBranch = {
      key,
      ctx,
      setCtx,
      attach: (el) => attach()(el),
      setAttach: (fn) => setAttach(() => fn),
      element: null,
      nodes,
      dispose,
      retiring,
      setRetiring,
    };

    return branch;
  };

  const reclassifyAsOutgoing = (b: MountedBranch) => {
    const { ctx, attachElement } = props.controller.createContext(
      "outgoing",
      b.key,
    );
    b.setCtx(ctx);
    b.setAttach(attachElement);
    b.setRetiring(true);
    triggerAttach(b);
    ctx.done.then(() => {
      b.dispose();
      setBranches((list) => {
        const next = list.filter((x) => x !== b);
        if (next.every((x) => x.retiring())) props.controller.end();
        return next;
      });
    });
  };

  const swapInPlace = (key: string) => {
    const live = branches().find((b) => !b.retiring());
    if (live) live.dispose();
    const incoming = makeBranch(key, "incoming");
    setBranches([incoming]);
    triggerAttach(incoming);
  };

  // After hydration, capture the current page in a branch (no transition).
  onMount(() => {
    if (branches().length === 0) {
      const boot = makeBranch(props.branchKey(), "incoming");
      setBranches([boot]);
    }
  });

  createEffect((prev: { branchKey: string; locationKey: string } | undefined) => {
    if (isServer) return prev;

    const branchKey = props.branchKey();
    const locationKey = props.locationKey();

    if (prev === undefined) {
      return { branchKey, locationKey };
    }

    if (locationKey === prev.locationKey) return prev;

    if (branchKey === prev.branchKey) {
      if (branches().length > 0) {
        untrack(() => swapInPlace(branchKey));
      }
      return { branchKey, locationKey };
    }

    const cause = props.controller.consumeCause();
    props.controller.begin(cause, false);

    untrack(() => {
      const live = branches().filter((b) => !b.retiring());

      for (const b of live) {
        reclassifyAsOutgoing(b);
      }

      const incoming = makeBranch(branchKey, "incoming");
      setBranches([...branches(), incoming]);
      triggerAttach(incoming);
    });

    return { branchKey, locationKey };
  });

  onCleanup(() => {
    for (const b of branches()) b.dispose();
  });

  const stackActive = () => !isServer && branches().length > 0;

  if (!stackActive()) {
    return props.children();
  }

  return (
    <div data-router-stack style={{ display: "grid" }}>
      <For each={branches()}>
        {(branch) => (
          <BranchContext.Provider value={branch.ctx()}>
            <div
              data-router-branch={branch.ctx().role}
              aria-hidden={branch.retiring() ? "true" : undefined}
              style={{
                "grid-area": "1 / 1",
                "pointer-events": branch.retiring() ? "none" : undefined,
                visibility:
                  props.hideIncomingUntilEnter &&
                  !branch.retiring() &&
                  props.controller.isActive() &&
                  branch.ctx().phase() === "entering"
                    ? "hidden"
                    : undefined,
              }}
              ref={(el: HTMLElement) => {
                branch.element = el;
                triggerAttach(branch);
              }}
            >
              {branch.nodes}
            </div>
          </BranchContext.Provider>
        )}
      </For>
    </div>
  );
}
