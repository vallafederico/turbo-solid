import type { MouseEvent } from "react";

export const SCROLL_OFFSET = -48;
export const MAIN_OUT_DURATION = 0.4;
export const MAIN_IN_DURATION = 0.4;
export const MAIN_IN_DELAY = 0.0;

const outTransitions = new Set<() => void | Promise<void>>();

export function setOutTransition(fn: () => void | Promise<void>): () => void {
  outTransitions.add(fn);
  return () => outTransitions.delete(fn);
}

export function resetOutTransitions(): void {
  outTransitions.clear();
}

export async function animateOut(): Promise<void> {
  if (outTransitions.size === 0) return;

  await Promise.all(
    Array.from(outTransitions, (fn) => Promise.resolve(fn())),
  );
  resetOutTransitions();
}

export function getHash(pathname: string): string | null {
  const hash = pathname.split("#")[1];
  return hash ? `#${hash}` : null;
}

export function cleanPathname(pathname: string): string {
  return pathname.split("#")[0].split("?")[0];
}

export function isModifiedNavigationEvent(event: MouseEvent): boolean {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

export function getTransitionTargets(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-page-transition="route"]'),
  );
}
