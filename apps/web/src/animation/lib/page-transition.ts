import { useBeforeLeave } from "@solidjs/router";

let outTransitions = [] as (() => any)[];

export const setOutTransition = (fn: () => any) => {
  outTransitions.push(fn);
};

export function reset() {
  outTransitions.length = 0;
  outTransitions = [];
  // outTransitions.push(globalOut);
}

export async function animateOut() {
  await Promise.all(outTransitions.map(async (fn) => await fn()));
  reset();
}

export function usePageTransition() {
  useBeforeLeave(async (e: any) => {
    e.preventDefault();
    await animateOut();
    e.retry(true);
  });
}
