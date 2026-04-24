"use client";

import type { CSSProperties } from "react";

import { useOnTrack } from "@/animation";

export default function TrackProgress() {
  const ref = useOnTrack<HTMLDivElement>(
    (progress, _scroll, element) => {
      element.style.setProperty("--progress", progress.toFixed(4));
    },
    { lerp: 0.12 },
  );

  return (
    <div
      className="mx-auto grid w-grids-8 gap-4 rounded-md border border-gray-800 p-6"
      ref={ref}
      style={{ "--progress": 0 } as CSSProperties}
    >
      <p>Scroll progress</p>
      <div className="h-[1px] w-full bg-white/20">
        <div
          className="h-full origin-left bg-white"
          style={{ transform: "scaleX(var(--progress))" }}
        />
      </div>
      <p className="font-mono text-sm opacity-60">driven by useOnTrack</p>
    </div>
  );
}
