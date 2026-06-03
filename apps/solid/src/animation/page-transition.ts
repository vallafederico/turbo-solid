import {
  type BeforeLeaveEventArgs,
  useBeforeLeave,
  useIsRouting,
  useNavigate,
  usePreloadRoute,
} from "@solidjs/router";
import { onCleanup, untrack } from "solid-js";
import gsap from "~/lib/gsap";
import { Scroll } from "~/lib/utils/scroll";

/** Seconds — `<main>` / `<footer>` opacity during SPA navigations. */
export const SCROLL_OFFSET = -48;
const MAIN_OUT_DURATION = 0.4;
const MAIN_IN_DURATION = 0.4;
const MAIN_IN_DELAY = 0.0;

const MAIN_FOOTER = ["main", "footer"] as const;

type OutTransition = {
  run: () => void | Promise<void>;
};

let outTransitions: OutTransition[] = [];

/** Register a leave animation. Returns unregister — call from `onCleanup`. */
export const setOutTransition = (
  fn: () => void | Promise<void>,
): (() => void) => {
  const entry: OutTransition = { run: fn };
  outTransitions.push(entry);
  return () => {
    const i = outTransitions.indexOf(entry);
    if (i >= 0) outTransitions.splice(i, 1);
  };
};

export function reset() {
  outTransitions.length = 0;
}

/**
 * One-shot flag: when set, the next SPA navigation swaps content in place
 * (no fade out/in, no scroll reset). Trigger it right before navigations that
 * should feel instant — e.g. filtering, sorting, or selecting a variant.
 */
let skipNextTransition = false;

export const skipPageTransition = () => {
  skipNextTransition = true;
};

/**
 * `onClick` helper for `<A>` links: skips the transition for the resulting
 * navigation, but ignores modified/middle clicks (which open a new tab and
 * never navigate, so the flag must not leak to the next navigation).
 */
export const skipTransitionClick = (e: MouseEvent) => {
  if (
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  ) {
    return;
  }
  skipNextTransition = true;
};

const consumeSkipTransition = () => {
  if (!skipNextTransition) return false;
  skipNextTransition = false;
  return true;
};

const getHash = (pathname: string) => {
  const hasHash = pathname.includes("#");
  if (!hasHash) return null;
  return `#${pathname.split("#")[1]}`;
};

const cleanPathname = (pathname: string) => {
  return pathname.split("#")[0];
};

export async function animateOut() {
  if (outTransitions.length === 0) return;
  const pending = outTransitions.splice(0);
  await Promise.all(
    pending.map((entry) => Promise.resolve(entry.run())),
  );
}

/** Router transition compnfoletes after a frame; rAF avoids starving Solid’s update. */
async function whenRoutingSettled(
  isRouting: () => boolean,
) {
  await Promise.resolve();
  while (untrack(isRouting)) {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }
}

export function usePageTransition() {
  const navigate = useNavigate();
  const isRouting = useIsRouting();
  const preload = usePreloadRoute();
  const skipNextLeave = { v: false };

  useBeforeLeave(async (e: BeforeLeaveEventArgs) => {
    if (skipNextLeave.v) {
      skipNextLeave.v = false;
      return;
    }

    if (typeof e.to === "number") {
      return;
    }

    // Skip the fade and swap content in place (filter/sort/variant changes).
    if (consumeSkipTransition()) {
      e.preventDefault();
      skipNextLeave.v = true;
      navigate(e.to, {
        ...e.options,
        resolve: false,
        scroll: false,
      });
      return;
    }

    e.preventDefault();

    if (typeof window !== "undefined") {
      preload(e.to, { preloadData: true });
    }

    await animateOut();
    await gsap.to(MAIN_FOOTER, {
      opacity: 0,
      duration: MAIN_OUT_DURATION,
    });
    const toPathname = e.to.split("?")[0];
    const currentPathname = location.pathname;

    const isExtraneousChange =
      cleanPathname(toPathname) ===
      cleanPathname(currentPathname);

    skipNextLeave.v = true;
    navigate(e.to, {
      ...e.options,
      resolve: false,
      scroll: false,
    });
    await whenRoutingSettled(isRouting);

    if (!isExtraneousChange) {
      const hash = getHash(toPathname);

      if (hash) {
        Scroll.lenis?.scrollTo(hash, {
          offset: SCROLL_OFFSET,
        });
      } else {
        Scroll.lenis?.scrollTo(0, { immediate: true });
      }
    }

    gsap.to(MAIN_FOOTER, {
      opacity: 1,
      duration: MAIN_IN_DURATION,
      delay: MAIN_IN_DELAY,
    });
  });

  if (typeof window !== "undefined") {
    const handlePopState = async () => {
      await animateOut();
      Scroll.lenis?.scrollTo(0, { immediate: true });
    };

    window.addEventListener("popstate", handlePopState);
    onCleanup(() =>
      window.removeEventListener(
        "popstate",
        handlePopState,
      ),
    );
  }
}
