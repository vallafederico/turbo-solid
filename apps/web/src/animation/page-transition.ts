import { useBeforeLeave } from "@solidjs/router";
import { Scroll } from "~/lib/utils/scroll";

let outTransitions = [] as (() => any)[];

export const setOutTransition = (fn: () => any) => {
  outTransitions.push(fn);
};

export function reset() {
  outTransitions.length = 0;
  outTransitions = [];
}

export async function animateOut() {
  await Promise.all(outTransitions.map(async (fn) => await fn()));
  reset();
}

export function usePageTransition() {
  useBeforeLeave(async (e: any) => {
    if (typeof e.to === "number") {
      return;
    }

    e.preventDefault();
    await animateOut();
    const toPathname = e.to.split("?")[0];
    const currentPathname = location.pathname;

    // 3. Check if we are staying on the same page (Query change only)
    const isQueryOnlyChange = toPathname === currentPathname;

    if (!isQueryOnlyChange) {
      Scroll.lenis?.scrollTo(0, { immediate: true });
    }

    e.retry(true);
  });

  if (typeof window !== "undefined") {
    const handlePopState = async (event: PopStateEvent) => {
      await animateOut();
      Scroll.lenis?.scrollTo(0, { immediate: true });
    };

    window.addEventListener("popstate", handlePopState);
  }
}
