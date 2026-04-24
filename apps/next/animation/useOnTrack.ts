"use client";

import type { RefCallback } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLatest } from "@/animation/useLatest";
import { Raf } from "@/lib/raf";
import { clamp, lerp as lerpValue, map } from "@/lib/math";
import { Scroll, type ScrollEvent } from "@/lib/scroll";

type TrackEdge = "top" | "center" | "bottom";

export interface OnTrackOptions {
  top?: TrackEdge;
  bottom?: TrackEdge;
  lerp?: number | false;
  priority?: number;
}

interface Bounds {
  top: number;
  bottom: number;
}

function edgeOffset(edge: TrackEdge, viewportHeight: number): number {
  if (edge === "center") return viewportHeight / 2;
  if (edge === "bottom") return viewportHeight;
  return 0;
}

function computeBounds(
  element: HTMLElement,
  top: TrackEdge,
  bottom: TrackEdge,
): Bounds {
  const rect = element.getBoundingClientRect();
  const scroll = Scroll.scrollEventData.scroll;
  const viewportHeight = window.innerHeight;

  return {
    top: rect.top + scroll - edgeOffset(top, viewportHeight),
    bottom: rect.bottom + scroll - edgeOffset(bottom, viewportHeight),
  };
}

export function useOnTrack<T extends HTMLElement>(
  callback: (progress: number, scroll: ScrollEvent, element: T) => void,
  {
    top = "bottom",
    bottom = "top",
    lerp = false,
    priority = 0,
  }: OnTrackOptions = {},
): RefCallback<T> {
  const [element, setElement] = useState<T | null>(null);
  const boundsRef = useRef<Bounds | null>(null);
  const visibleRef = useRef(false);
  const lerpedRef = useRef(0);
  const callbackRef = useLatest(callback);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  useEffect(() => {
    if (!element) return;

    const updateBounds = () => {
      boundsRef.current = computeBounds(element, top, bottom);
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    const observer = new ResizeObserver(updateBounds);
    observer.observe(element);

    return () => {
      window.removeEventListener("resize", updateBounds);
      observer.disconnect();
    };
  }, [bottom, element, top]);

  useEffect(() => {
    if (!element) return;

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

      callbackRef.current(progress, scroll, element);
    };

    if (lerp === false) return Scroll.add(execute, priority);

    Raf.init();
    return Raf.add(execute, priority);
    // callbackRef is a stable ref from useLatest.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, lerp, priority]);

  return useCallback((node: T | null) => {
    visibleRef.current = false;
    boundsRef.current = null;
    lerpedRef.current = 0;
    setElement(node);
  }, []);
}
