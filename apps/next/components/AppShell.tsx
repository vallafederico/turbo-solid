"use client";

import type { PropsWithChildren } from "react";

import Grid from "@/components/Grid";
import LenisProvider from "@/components/LenisProvider";
import Nav from "@/components/Nav";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <LenisProvider>
      <Nav />
      {children}
      <Grid />
    </LenisProvider>
  );
}
