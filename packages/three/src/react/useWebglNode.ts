"use client";

import { useEffect, useRef, useState } from "react";

import { mountWebglNode } from "../core/mountWebglNode";
import type {
  WebglNodeConstructor,
  WebglNodeInstance,
} from "../core/mountWebglNode";

/**
 * React port of `@local/three/solid` `useWebglNode`: ref + visibility + dispose.
 */
export function useWebglNode(
  classToInstantiate: WebglNodeConstructor,
  sceneToAttachTo: object | null = null,
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const nodeRef = useRef<WebglNodeInstance | undefined>(undefined);
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

    const mounted = mountWebglNode({
      el,
      classToInstantiate,
      attachTo: sceneToAttachTo,
      getInView: () => visibleRef.current,
      onNode: (node) => {
        nodeRef.current = node;
      },
    });

    return () => {
      io.disconnect();
      mounted.dispose();
    };
  }, [classToInstantiate, sceneToAttachTo]);

  useEffect(() => {
    if (nodeRef.current) nodeRef.current.inView = visible;
  }, [visible]);

  return ref;
}
