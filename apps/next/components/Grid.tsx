"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "grid";
const DEFAULT_COLUMNS = 12;

const visibilityListeners = new Set<() => void>();

function readVisibility(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function setVisibility(next: boolean): void {
  window.localStorage.setItem(STORAGE_KEY, String(next));
  visibilityListeners.forEach((listener) => listener());
}

function subscribeVisibility(listener: () => void): () => void {
  visibilityListeners.add(listener);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!event.shiftKey || event.key.toLowerCase() !== "g") return;
    setVisibility(!readVisibility());
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    visibilityListeners.delete(listener);
    document.removeEventListener("keydown", handleKeyDown);
  };
}

function readColumns(): number {
  if (typeof window === "undefined") return DEFAULT_COLUMNS;
  const value = Number(
    getComputedStyle(document.documentElement).getPropertyValue("--columns"),
  );
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_COLUMNS;
}

function subscribeColumns(listener: () => void): () => void {
  window.addEventListener("resize", listener);
  return () => window.removeEventListener("resize", listener);
}

const getServerVisibility = () => false;
const getServerColumns = () => DEFAULT_COLUMNS;

export default function Grid() {
  const visible = useSyncExternalStore(
    subscribeVisibility,
    readVisibility,
    getServerVisibility,
  );
  const columns = useSyncExternalStore(
    subscribeColumns,
    readColumns,
    getServerColumns,
  );

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-10 flex h-screen justify-between gap-(--gutter) px-gx"
      style={{ width: "calc(100vw - var(--scrollbar-w, 0px))" }}
    >
      {Array.from({ length: columns }, (_, index) => (
        <div className="grow bg-red-500 opacity-10" key={index} />
      ))}
    </div>
  );
}
