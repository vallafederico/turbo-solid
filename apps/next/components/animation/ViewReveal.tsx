"use client";

import type { PropsWithChildren } from "react";

import { useOnView } from "@/animation";
import gsap from "@/lib/gsap";

export default function ViewReveal({ children }: PropsWithChildren) {
  const ref = useOnView<HTMLDivElement>({
    once: true,
    threshold: 0.2,
    onEnter: (_entry, element) => {
      gsap.to(element, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "expo.out",
      });
    },
  });

  return (
    <div className="translate-y-6 opacity-0" ref={ref}>
      {children}
    </div>
  );
}
