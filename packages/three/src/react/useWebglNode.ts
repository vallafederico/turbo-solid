"use client";

import { useEffect, useRef, useState } from "react";

import { createWebGlNode } from "../core/createWebGlNode";
import { runWhenAttachTargetReady } from "../core/runWhenAttachTargetReady";

/**
 * React port of `@local/three/solid` `useWebglNode`: ref + visibility + dispose.
 */
export function useWebglNode(
  classToInstantiate: new (el: HTMLElement) => {
    dispose?: () => void;
    inView?: boolean;
  },
  sceneToAttachTo: object | null = null,
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const nodeRef = useRef<
    { dispose?: () => void; inView?: boolean } | undefined
  >(undefined);
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        setVisible(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0 },
    );
    io.observe(el);

    const stopWait = runWhenAttachTargetReady(
      sceneToAttachTo,
      () => {
        const it = createWebGlNode(el, classToInstantiate, sceneToAttachTo);
        if (it) {
          it.inView = visibleRef.current;
        }
        nodeRef.current = it;
      },
    );

    return () => {
      stopWait();
      io.disconnect();
      nodeRef.current?.dispose?.();
      nodeRef.current = undefined;
    };
  }, [classToInstantiate, sceneToAttachTo]);

  useEffect(() => {
    if (nodeRef.current) nodeRef.current.inView = visible;
  }, [visible]);

  return ref;
}
