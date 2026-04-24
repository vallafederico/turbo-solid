"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { setOutTransition } from "@/animation/page-transition";

interface IntersectOptions extends IntersectionObserverInit {
  once?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function useIntersect<T extends Element>(
  ref: RefObject<T | null>,
  {
    onEnter,
    onLeave,
    once = true,
    threshold = 0.1,
    root,
    rootMargin,
  }: IntersectOptions = {},
): void {
  const enteredRef = useRef(false);
  const onEnterRef = useRef(onEnter);
  const onLeaveRef = useRef(onLeave);

  useEffect(() => {
    onEnterRef.current = onEnter;
    onLeaveRef.current = onLeave;
  }, [onEnter, onLeave]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!once || !enteredRef.current) {
            enteredRef.current = true;
            onEnterRef.current?.();
          }

          if (once) observer.unobserve(element);
        } else {
          onLeaveRef.current?.();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, ref, root, rootMargin, threshold]);
}

export function usePageLeave<T extends Element>(
  ref: RefObject<T | null>,
  callback?: () => void | Promise<void>,
): void {
  const visibleRef = useRef(false);
  const callbackRef = useRef(callback);

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
    return setOutTransition(() => {
      if (!visibleRef.current) return;
      return callbackRef.current?.();
    });
  }, []);
}
