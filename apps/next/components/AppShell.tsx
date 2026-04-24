"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { pageTransition } from "@/animation/page-transition";
import { useLenisRoot } from "@/animation/useLenisRoot";
import Grid from "@/components/Grid";
import Nav from "@/components/Nav";

export default function AppShell({ children }: PropsWithChildren) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLenisRoot(wrapperRef, contentRef);

  useEffect(() => {
    pageTransition.handlePathnameChange(pathname);
  }, [pathname]);

  useEffect(() => {
    const handler = () => pageTransition.handlePopState();
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  return (
    <div className="h-full overflow-y-auto" id="app" ref={wrapperRef}>
      <div ref={contentRef}>
        <Nav />
        <main data-page-transition="route">{children}</main>
        <Grid />
      </div>
    </div>
  );
}
