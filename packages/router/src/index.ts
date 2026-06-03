/**
 * @acme/router — custom router for SolidStart.
 *
 * Re-exports the entire @solidjs/router surface (so this is a drop-in swap),
 * then overrides <Router> with the dual-mount transition-aware version and
 * adds the transition hooks/presets.
 *
 * Migration: change `from "@solidjs/router"` to `from "@acme/router"`. The only
 * behavioural change is that <Router> now accepts a `transition` prop and the
 * page-transition hooks become available. `<A>`, `useNavigate`, `query`,
 * `action`, `createAsync`, `useBeforeLeave`, etc. are the upstream ones,
 * untouched.
 */

// Everything from upstream — A, useNavigate, useLocation, useParams,
// useSearchParams, useIsRouting, useBeforeLeave, usePreloadRoute, query,
// action, createAsync, redirect, reload, Route, etc.
export * from "@solidjs/router";

// Override the Router export with our transition-aware one. Because this comes
// after `export *`, it shadows the upstream Router for consumers.
export { Router } from "./router";
export type { RouterProps } from "./router";

// Transition system.
export {
  useRouteTransition,
  onEnter,
  onLeave,
  beforeLeave,
  useTransitionDirection,
  useSharedElement,
} from "./transitions/hooks";

export { useLayoutTransition } from "./transitions/layout-transition";
export type { LayoutTransitionOptions } from "./transitions/layout-transition";

export { useController } from "./transitions/context";

export {
  useCrossFade,
  useDirectionalSlide,
  useCoverSlideUp,
} from "./transitions/presets";

export {
  getBranchKey,
  destinationPathname,
  isSameLeafNavigation,
} from "./transitions/same-leaf";

export type {
  TransitionConfig,
  TransitionContextValue,
  TransitionDirection,
  TransitionPhase,
  TransitionRunner,
} from "./types";
