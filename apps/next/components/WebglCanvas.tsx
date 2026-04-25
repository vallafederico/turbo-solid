"use client";

import { useMemo } from "react";
import { Canvas, type CanvasDeps } from "@local/three/react";

import gsap from "@/lib/gsap";
import { Gui } from "@/lib/gui";
import { lerp } from "@/lib/math";
import { Resizer } from "@/lib/resizer";
import { Scroll } from "@/lib/scroll";
import { clientRectGl } from "@/lib/clientRectGl";
import { setWebgl } from "@/lib/webglStore";
import { assets } from "@/lib/webgl-assets";

/**
 * Wires the same `CanvasDeps` the Solid app passes to `<Canvas />` in `app.tsx`.
 * Kept in one place so HMR and dependency injection stay obvious.
 */
export default function WebglCanvas() {
  const deps = useMemo<CanvasDeps>(
    () => ({
      gsap,
      Gui,
      lerp,
      Scroll,
      Resizer,
      setWebgl,
      assets,
      clientRectGl,
    }),
    [],
  );

  return <Canvas deps={deps} />;
}
