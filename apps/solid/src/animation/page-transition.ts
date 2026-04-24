import {
  type BeforeLeaveEventArgs,
  useBeforeLeave,
  useIsRouting,
  useNavigate,
  usePreloadRoute,
} from "@solidjs/router";
import { onCleanup } from "solid-js";
import gsap from "~/lib/gsap";
import { Scroll } from "~/lib/utils/scroll";

/** Seconds — `<main>` / `<footer>` opacity during SPA navigations. */
export const SCROLL_OFFSET = -48;
const MAIN_OUT_DURATION = 0.4;
const MAIN_IN_DURATION = 0.4;
const MAIN_IN_DELAY = 0.0;

const MAIN_FOOTER = ["main", "footer"] as const;

let outTransitions = [] as (() => void | Promise<void>)[];

export const setOutTransition = (
  fn: () => void | Promise<void>,
) => {
  outTransitions.push(fn);
};

export function reset() {
  outTransitions.length = 0;
}

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
  await Promise.all(
    outTransitions.map((fn) => Promise.resolve(fn())),
  );
  reset();
}

/** Router transition compnfoletes after a frame; rAF avoids starving Solid’s update. */
async function whenRoutingSettled(
  isRouting: () => boolean,
) {
  await Promise.resolve();
  while (isRouting()) {
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

    e.preventDefault();

    if (typeof window !== "undefined") {
      preload(e.to, { preloadData: true });
      await new Promise<void>((resolve) =>
        queueMicrotask(resolve),
      );
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
