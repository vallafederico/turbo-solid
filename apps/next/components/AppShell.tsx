"use client";

import type { PropsWithChildren } from "react";

import Grid from "@/components/Grid";
import LenisProvider from "@/components/LenisProvider";
import Nav from "@/components/Nav";
import { PageTransitionProvider } from "@/components/PageTransitionProvider";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <LenisProvider>
      <PageTransitionProvider>
        <Nav />
        <main data-page-transition="route">{children}</main>
        <Grid />
      </PageTransitionProvider>
    </LenisProvider>
  );
}
