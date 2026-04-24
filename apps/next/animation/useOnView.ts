"use client";

import type { RefCallback } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { setOutTransition } from "@/animation/page-transition";
import { useLatest } from "@/animation/useLatest";

type ViewCallback<T extends Element> = (entry: IntersectionObserverEntry, element: T) => void;

export interface OnViewOptions<T extends Element> extends IntersectionObserverInit {
  once?: boolean;
  onEnter?: ViewCallback<T>;
  onLeave?: ViewCallback<T>;
}

export function useOnView<T extends Element>({
  onEnter,
  onLeave,
  once = true,
  root = null,
  rootMargin,
  threshold = 0.1,
}: OnViewOptions<T> = {}): RefCallback<T> {
  const [element, setElement] = useState<T | null>(null);
  const enteredRef = useRef(false);
  const onEnterRef = useLatest(onEnter);
  const onLeaveRef = useLatest(onLeave);

  const observerOptions = useMemo(
    () => ({
      root,
      rootMargin,
      threshold,
    }),
    [root, rootMargin, threshold],
  );

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!once || !enteredRef.current) {
          enteredRef.current = true;
          onEnterRef.current?.(entry, element);
        }

        if (once) observer.unobserve(element);
        return;
      }

      onLeaveRef.current?.(entry, element);
    }, observerOptions);

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, observerOptions, once, onEnterRef, onLeaveRef]);

  return useCallback((node: T | null) => {
    if (node) enteredRef.current = false;
    setElement(node);
  }, []);
}

export function useOnPageLeave<T extends Element>(
  callback?: () => void | Promise<void>,
): RefCallback<T> {
  const visibleRef = useRef(false);
  const callbackRef = useLatest(callback);

  const ref = useOnView<T>({
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
    return setOutTransition(() => {
      if (!visibleRef.current) return;
      return callbackRef.current?.();
    });
  }, [callbackRef]);

  return ref;
}
