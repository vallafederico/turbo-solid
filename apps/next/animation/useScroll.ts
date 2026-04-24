"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { useIntersect } from "@/animation/useIntersect";
import { Raf } from "@/lib/raf";
import { clamp, lerp as lerpValue, map } from "@/lib/math";
import { Scroll, type ScrollEvent } from "@/lib/scroll";

type Edge = "top" | "center" | "bottom";

interface TrackOptions {
  top?: Edge;
  bottom?: Edge;
  lerp?: number | false;
}

interface Bounds {
  top: number;
  bottom: number;
  viewportHeight: number;
}

function edgeOffset(edge: Edge, viewportHeight: number): number {
  if (edge === "center") return viewportHeight / 2;
  if (edge === "bottom") return viewportHeight;
  return 0;
}

function computeBounds(
  element: HTMLElement,
  { top = "bottom", bottom = "top" }: TrackOptions,
): Bounds {
  const rect = element.getBoundingClientRect();
  const scroll = Scroll.scrollEventData.scroll;
  const viewportHeight = window.innerHeight;

  return {
    top: rect.top + scroll - edgeOffset(top, viewportHeight),
    bottom: rect.bottom + scroll - edgeOffset(bottom, viewportHeight),
    viewportHeight,
  };
}

export function useScroll(
  callback: (event: ScrollEvent) => void,
  priority = 0,
): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = Symbol("scroll");
    return Scroll.add((event) => callbackRef.current(event), priority, id);
  }, [priority]);
}

export function useTrack<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: (progress: number, scroll: ScrollEvent) => void,
  { top = "bottom", bottom = "top", lerp = false }: TrackOptions = {},
): void {
  const callbackRef = useRef(callback);
  const boundsRef = useRef<Bounds | null>(null);
  const visibleRef = useRef(false);
  const lerpedRef = useRef(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useIntersect(ref, {
    once: false,
    threshold: 0,
    onEnter: () => {
      visibleRef.current = true;
    },
    onLeave: () => {
      visibleRef.current = false;
    },
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateBounds = () => {
      boundsRef.current = computeBounds(element, { top, bottom, lerp });
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    const observer = new ResizeObserver(updateBounds);
    observer.observe(element);

    return () => {
      window.removeEventListener("resize", updateBounds);
      observer.disconnect();
    };
  }, [bottom, lerp, ref, top]);

  useEffect(() => {
    const execute = () => {
      const bounds = boundsRef.current;
      if (!bounds || !visibleRef.current) return;

      const scroll = Scroll.scrollEventData;
      let progress = clamp(
        0,
        1,
        map(scroll.scroll, bounds.top, bounds.bottom, 0, 1),
      );

      if (lerp !== false) {
        progress = lerpValue(lerpedRef.current, progress, lerp);
        lerpedRef.current = progress;
      }

      callbackRef.current(progress, scroll);
    };

    if (lerp === false) {
      return Scroll.add(execute);
    }

    Raf.init();
    return Raf.add(execute);
  }, [lerp]);
}
