"use client";

import { useSyncExternalStore } from "react";

import { pageTransition } from "@/animation/page-transition";

const getServerSnapshot = () => false;

export function useIsTransitioning(): boolean {
  return useSyncExternalStore(
    pageTransition.subscribe,
    pageTransition.getIsTransitioning,
    getServerSnapshot,
  );
}
