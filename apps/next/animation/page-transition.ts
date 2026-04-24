import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { MouseEvent } from "react";
import { startTransition } from "react";

import gsap from "@/lib/gsap";
import { Scroll } from "@/lib/scroll";

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

interface PendingTransition {
  cleanHref: string;
  hash: string | null;
}

class PageTransitionState {
  private listeners = new Set<() => void>();
  private isTransitioning = false;
  private pending: PendingTransition | null = null;

  getIsTransitioning = (): boolean => this.isTransitioning;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private setTransitioning(value: boolean): void {
    if (this.isTransitioning === value) return;
    this.isTransitioning = value;
    this.listeners.forEach((listener) => listener());
  }

  navigate = async (href: string, router: AppRouterInstance): Promise<void> => {
    if (typeof window === "undefined" || this.isTransitioning) return;

    const target = new URL(href, window.location.href);
    if (target.origin !== window.location.origin) {
      window.location.assign(target.href);
      return;
    }

    const currentPath = `${window.location.pathname}${window.location.search}`;
    const targetPath = `${target.pathname}${target.search}`;
    const hash = getHash(target.href);

    if (currentPath === targetPath) {
      if (hash) {
        Scroll.to(hash, { offset: SCROLL_OFFSET });
        window.history.pushState(null, "", `${targetPath}${hash}`);
      }
      return;
    }

    this.setTransitioning(true);

    await animateOut();
    await gsap.to(getTransitionTargets(), {
      opacity: 0,
      duration: MAIN_OUT_DURATION,
    });

    this.pending = {
      cleanHref: cleanPathname(targetPath),
      hash,
    };

    startTransition(() => {
      router.push(`${targetPath}${target.hash}`, { scroll: false });
    });
  };

  handlePathnameChange = (pathname: string): void => {
    const pending = this.pending;
    if (!pending) return;

    this.pending = null;

    const currentPath = `${pathname}${window.location.search}`;
    if (pending.cleanHref !== cleanPathname(currentPath)) {
      this.setTransitioning(false);
      return;
    }

    if (pending.hash) Scroll.to(pending.hash, { offset: SCROLL_OFFSET });
    else Scroll.to(0, { immediate: true });

    gsap
      .to(getTransitionTargets(), {
        opacity: 1,
        duration: MAIN_IN_DURATION,
        delay: MAIN_IN_DELAY,
      })
      .then(() => this.setTransitioning(false));
  };

  handlePopState = async (): Promise<void> => {
    this.pending = null;
    await animateOut();
    Scroll.to(0, { immediate: true });
    gsap.set(getTransitionTargets(), { opacity: 1 });
    this.setTransitioning(false);
  };
}

const globalPT = globalThis as typeof globalThis & {
  __nextPageTransition?: PageTransitionState;
};

export const pageTransition =
  globalPT.__nextPageTransition ?? new PageTransitionState();
globalPT.__nextPageTransition = pageTransition;
