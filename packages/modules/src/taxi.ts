import { Core, Transition } from "@unseenco/taxi";

export type TaxiHooks = {
  onLeave?: (from: Element) => void | Promise<void>;
  onEnter?: (to: Element) => void | Promise<void>;
};

let currentHooks: TaxiHooks = {};

/**
 * Taxi transition that delegates leave/enter to the app (GSAP, modules, scroll).
 * Markup contract (Study Hall / starters):
 *   <div data-taxi>
 *     <main data-taxi-view>…page…</main>
 *   </div>
 */
class AppTransition extends Transition {
  onLeave({
    from,
    done,
  }: {
    from: Element;
    done: () => void;
  }) {
    Promise.resolve(currentHooks.onLeave?.(from)).then(() => done());
  }

  onEnter({
    to,
    done,
  }: {
    to: Element;
    done: () => void;
  }) {
    Promise.resolve(currentHooks.onEnter?.(to)).then(() => done());
  }
}

export type TaxiHandle = {
  core: Core;
  destroy: () => void;
};

export function createTaxi(hooks: TaxiHooks = {}): TaxiHandle {
  currentHooks = hooks;

  const core = new Core({
    links: "a:not([target]):not([href^=\\#]):not([data-taxi-ignore])",
    removeOldContent: true,
    allowInterruption: false,
    bypassCache: false,
    // App JS is a single bundled entry — do not re-run page scripts.
    reloadJsFilter: false,
    transitions: {
      default: AppTransition,
    },
  });

  return {
    core,
    destroy() {
      currentHooks = {};
    },
  };
}
