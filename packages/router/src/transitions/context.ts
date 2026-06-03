import { createContext, useContext } from "solid-js";
import type { TransitionController } from "./controller";
import type { TransitionContextValue } from "../types";

/** Router-wide controller. Provided once by the custom Router. */
export const ControllerContext = createContext<TransitionController>();

export function useController(): TransitionController {
  const c = useContext(ControllerContext);
  if (!c) {
    throw new Error(
      "[router] transition hooks must be used inside the custom <Router>.",
    );
  }
  return c;
}

/**
 * Per-branch context. Each mounted page (outgoing or incoming) sits inside its
 * own provider, so `useRouteTransition()` resolves to the right side
 * automatically without the page needing to know which it is.
 */
export const BranchContext = createContext<TransitionContextValue>();

export function useBranch(): TransitionContextValue | undefined {
  return useContext(BranchContext);
}
