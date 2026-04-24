"use client";

import type { PropsWithChildren, RefCallback } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useOnPageLeave, useOnView } from "@/animation";
import gsap, { A, SplitText as GsapSplitText } from "@/lib/gsap";

type SplitType = "words" | "chars" | "lines";

interface SplitTextProps extends PropsWithChildren {
  className?: string;
  type?: SplitType;
}

type SplitTextInstance = InstanceType<typeof GsapSplitText>;

function mergeRefs<T>(...refs: RefCallback<T>[]): RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => ref(node));
  };
}

export default function SplitText({
  children,
  className = "",
  type = "chars",
}: SplitTextProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const splitRef = useRef<SplitTextInstance | null>(null);
  const animateInRef = useRef<gsap.core.Tween | null>(null);

  const reset = useCallback(() => {
    const split = splitRef.current;
    if (!split) return;

    animateInRef.current?.kill();
    gsap.set(split.chars, { yPercent: 100 });
  }, []);

  const viewRef = useOnView<HTMLDivElement>({
    once: false,
    threshold: 0.1,
    onEnter: () => {
      const split = splitRef.current;
      if (!split) return;

      animateInRef.current?.kill();
      animateInRef.current = gsap.to(split.chars, {
        yPercent: 0,
        ease: A.page.in.ease,
        duration: A.page.in.duration,
        stagger: {
          each: 0.02,
          from: "start",
        },
      });
    },
    onLeave: reset,
  });

  const pageLeaveRef = useOnPageLeave<HTMLDivElement>(async () => {
    const split = splitRef.current;
    if (!split) return;

    animateInRef.current?.kill();
    await gsap.to(split.chars, {
      yPercent: 100,
      ease: A.page.out.ease,
      duration: A.page.out.duration,
    });
  });

  useEffect(() => {
    if (!element) return;

    const split = new GsapSplitText(element, {
      type: `words,${type}`,
      wordsClass: "split-w",
    });

    splitRef.current = split;
    gsap.set(element, { autoAlpha: 1 });
    gsap.set(split.chars, { yPercent: 100 });

    return () => {
      animateInRef.current?.kill();
      gsap.killTweensOf(split.chars);
      gsap.killTweensOf(element);
      split.revert();
      splitRef.current = null;
      animateInRef.current = null;
    };
  }, [element, type]);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      setElement(node);
      mergeRefs(viewRef, pageLeaveRef)(node);
    },
    [pageLeaveRef, viewRef],
  );

  return (
    <div className={`invisible ${className}`.trim()} data-split ref={ref}>
      {children}
    </div>
  );
}
