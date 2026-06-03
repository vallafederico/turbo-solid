import {
  Router as SolidRouter,
  useCurrentMatches,
  useLocation,
} from "@solidjs/router";
import {
  createMemo,
  onCleanup,
  splitProps,
  type Component,
  type JSX,
} from "solid-js";
import { TransitionController } from "./transitions/controller";
import { ControllerContext } from "./transitions/context";
import { BranchStack } from "./transitions/branch-stack";
import { NavigationGate } from "./transitions/navigation-gate";
import { getBranchKey } from "./transitions/same-leaf";
import type { TransitionConfig } from "./types";

export interface RouterProps {
  /** Persistent layout — same semantics as @solidjs/router's `root`. */
  root?: Component<{ children?: JSX.Element }>;
  base?: string;
  /** Transition behaviour. Set to `false` to opt out and behave like stock. */
  transition?: TransitionConfig | false;
  children?: JSX.Element;
}

const DEFAULTS: Required<TransitionConfig> = {
  timeoutMs: 1200,
  hideIncomingUntilEnter: false,
};

/**
 * Drop-in replacement for `@solidjs/router`'s <Router>. Routing behaviour is
 * unchanged — matching, preload, data APIs all come from upstream. The only
 * divergence is the render layer: the matched leaf is funnelled through a
 * BranchStack that can hold the previous page mounted alongside the next one.
 *
 * SSR and hydration render the matched route directly (passthrough). Dual-mount
 * activates on client-side navigations only.
 */
export function Router(props: RouterProps): JSX.Element {
  const [, rest] = splitProps(props, ["root", "transition", "children"]);

  const cfg =
    props.transition === false
      ? null
      : { ...DEFAULTS, ...(props.transition ?? {}) };

  const controller = new TransitionController(
    cfg?.timeoutMs ?? DEFAULTS.timeoutMs,
  );

  const UserRoot =
    props.root ?? ((p: { children?: JSX.Element }) => <>{p.children}</>);

  const TransitionRoot: Component<{ children?: JSX.Element }> = (rootProps) => {
    const matches = useCurrentMatches();
    const location = useLocation();

    onCleanup(() => controller.dispose());

    const branchKey = createMemo(() =>
      getBranchKey(matches(), location.pathname),
    );

    const locationKey = createMemo(
      () => branchKey() + (location.search || ""),
    );

    if (!cfg) {
      return <UserRoot>{rootProps.children}</UserRoot>;
    }

    return (
      <ControllerContext.Provider value={controller}>
        <NavigationGate />
        <UserRoot>
          <BranchStack
            controller={controller}
            branchKey={branchKey}
            locationKey={locationKey}
            hideIncomingUntilEnter={cfg.hideIncomingUntilEnter}
          >
            {() => rootProps.children}
          </BranchStack>
        </UserRoot>
      </ControllerContext.Provider>
    );
  };

  return (
    <SolidRouter root={TransitionRoot} {...rest}>
      {props.children}
    </SolidRouter>
  );
}
