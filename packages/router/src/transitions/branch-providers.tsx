import type { Accessor, JSX } from "solid-js";
import { BranchContext, BranchRegistrationContext } from "./context";
import type { TransitionContextValue } from "../types";

export type BeforeLeaveRegistration = {
  registerBeforeLeave: (fn: () => void | Promise<void>) => () => void;
};

/** Wraps page content so transition hooks resolve branch context correctly. */
export function BranchProviders(props: {
  ctx: Accessor<TransitionContextValue>;
  registration: BeforeLeaveRegistration;
  children: JSX.Element;
}): JSX.Element {
  return (
    <BranchRegistrationContext.Provider value={props.registration}>
      <BranchContext.Provider value={props.ctx()}>
        {props.children}
      </BranchContext.Provider>
    </BranchRegistrationContext.Provider>
  );
}

export function createBeforeLeaveRegistration(): {
  hooks: Set<() => void | Promise<void>>;
  registration: BeforeLeaveRegistration;
} {
  const hooks = new Set<() => void | Promise<void>>();
  const registration: BeforeLeaveRegistration = {
    registerBeforeLeave: (fn) => {
      hooks.add(fn);
      return () => hooks.delete(fn);
    },
  };
  return { hooks, registration };
}
