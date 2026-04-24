"use client";

import type { RefObject } from "react";
import { useEffect } from "react";
import Lenis from "lenis";

import { Raf } from "@/lib/raf";
import { Scroll } from "@/lib/scroll";

const LENIS_RAF_PRIORITY = -100;

export function useLenisRoot(
  wrapperRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      autoRaf: false,
      autoResize: false,
    });

    Scroll.setLenis(lenis);
    const offScroll = lenis.on("scroll", () => Scroll.notifyScroll());

    Raf.init();
    const offRaf = Raf.add((timeMs) => lenis.raf(timeMs), LENIS_RAF_PRIORITY);

    const observer = new ResizeObserver(() => Scroll.resize());
    observer.observe(content);

    return () => {
      offRaf();
      offScroll();
      observer.disconnect();
      Scroll.setLenis(undefined);
      lenis.destroy();
    };
  }, [contentRef, wrapperRef]);
}
