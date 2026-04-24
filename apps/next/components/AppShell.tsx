"use client";

import type { PropsWithChildren } from "react";

import Grid from "@/components/Grid";
import LenisProvider from "@/components/LenisProvider";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <LenisProvider>
      {children}
      <Grid />
    </LenisProvider>
  );
}
