"use client";

import { useEffect, useRef } from "react";
import { setGlContext } from "@local/gl-context";
import { Gl } from "../gl";
import type { CanvasDeps } from "../canvasTypes";

export type { CanvasDeps } from "../canvasTypes";

export interface ReactCanvasProps {
  deps: CanvasDeps;
  className?: string;
}

/**
 * React equivalent of `@local/three/solid` Canvas: sets gl-context, mounts WebGL, tears down on unmount (HMR-safe).
 */
export default function Canvas({ deps, className }: ReactCanvasProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const depsRef = useRef(deps);
  depsRef.current = deps;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setGlContext(depsRef.current);
    Gl.start(el);

    return () => {
      Gl.destroy();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className ?? "fixed inset-0 z-[-1] h-screen w-screen"}
    />
  );
}
