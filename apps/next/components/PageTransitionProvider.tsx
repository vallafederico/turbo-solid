"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  animateOut,
  cleanPathname,
  getHash,
  getTransitionTargets,
  MAIN_IN_DELAY,
  MAIN_IN_DURATION,
  MAIN_OUT_DURATION,
  SCROLL_OFFSET,
} from "@/animation/page-transition";
import gsap from "@/lib/gsap";
import { Scroll } from "@/lib/scroll";

interface PendingTransition {
  href: string;
  cleanHref: string;
  hash: string | null;
}

interface PageTransitionContextValue {
  isTransitioning: boolean;
  navigate: (href: string) => Promise<void>;
}

const PageTransitionContext =
  createContext<PageTransitionContextValue | null>(null);

function hrefToUrl(href: string): URL {
  return new URL(href, window.location.href);
}

export function PageTransitionProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const pendingRef = useRef<PendingTransition | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useCallback(
    async (href: string) => {
      if (typeof window === "undefined" || isTransitioning) return;

      const target = hrefToUrl(href);
      if (target.origin !== window.location.origin) {
        window.location.assign(target.href);
        return;
      }

      const currentPath = `${window.location.pathname}${window.location.search}`;
      const targetPath = `${target.pathname}${target.search}`;
      const hash = getHash(target.href);

      if (currentPath === targetPath && hash) {
        Scroll.to(hash, { offset: SCROLL_OFFSET });
        window.history.pushState(null, "", `${targetPath}${hash}`);
        return;
      }

      if (currentPath === targetPath && !hash) return;

      setIsTransitioning(true);
      router.prefetch(targetPath);
      await new Promise<void>((resolve) => queueMicrotask(resolve));

      await animateOut();
      await gsap.to(getTransitionTargets(), {
        opacity: 0,
        duration: MAIN_OUT_DURATION,
      });

      pendingRef.current = {
        href: `${targetPath}${target.hash}`,
        cleanHref: cleanPathname(targetPath),
        hash,
      };

      router.push(`${targetPath}${target.hash}`, { scroll: false });
    },
    [isTransitioning, router],
  );

  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending) return;

    pendingRef.current = null;

    const currentPath = `${pathname}${window.location.search}`;

    if (pending.cleanHref !== cleanPathname(currentPath)) {
      setIsTransitioning(false);
      return;
    }

    if (pending.hash) {
      Scroll.to(pending.hash, { offset: SCROLL_OFFSET });
    } else {
      Scroll.to(0, { immediate: true });
    }

    gsap
      .to(getTransitionTargets(), {
        opacity: 1,
        duration: MAIN_IN_DURATION,
        delay: MAIN_IN_DELAY,
      })
      .then(() => setIsTransitioning(false));
  }, [pathname]);

  useEffect(() => {
    const handlePopState = async () => {
      await animateOut();
      Scroll.to(0, { immediate: true });
      gsap.set(getTransitionTargets(), { opacity: 1 });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, navigate }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error(
      "usePageTransition must be used inside PageTransitionProvider",
    );
  }

  return context;
}
