"use client";

import type {
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  PropsWithChildren,
  ReactNode,
  RefAttributes,
} from "react";
import { useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import type { LenisOptions } from "lenis";

import gsap from "@/lib/gsap";
import { Raf } from "@/lib/raf";
import { Scroll } from "@/lib/scroll";

type ReactLenisProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children?: ReactNode;
  options?: LenisOptions;
  root?: boolean | "asChild";
};

const TypedReactLenis = ReactLenis as unknown as ForwardRefExoticComponent<
  ReactLenisProps & RefAttributes<LenisRef>
>;

function LenisBridge() {
  const lenis = useLenis((instance) => {
    Scroll.handleScroll(instance);
  });

  useEffect(() => {
    Scroll.setLenis(lenis);
    return () => Scroll.setLenis(undefined);
  }, [lenis]);

  return null;
}

export default function LenisProvider({ children }: PropsWithChildren) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    Raf.init();

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  useEffect(() => {
    const content = lenisRef.current?.content;
    if (!content) return;

    const observer = new ResizeObserver(() => Scroll.resize());
    observer.observe(content);

    return () => observer.disconnect();
  }, []);

  return (
    <TypedReactLenis
      className="h-full overflow-y-auto"
      id="app"
      options={{ autoRaf: false, autoResize: false }}
      ref={lenisRef}
      root="asChild"
    >
      <LenisBridge />
      {children}
    </TypedReactLenis>
  );
}
