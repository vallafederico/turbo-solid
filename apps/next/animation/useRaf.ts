"use client";

import { useEffect, useRef } from "react";

import { Raf } from "@/lib/raf";

export function useRaf(callback: (time: number) => void, priority = 0): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    Raf.init();
    const id = Symbol("raf");

    return Raf.add((time) => callbackRef.current(time), priority, id);
  }, [priority]);
}
