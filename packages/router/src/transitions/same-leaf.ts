import type { Location } from "@solidjs/router";

/** Resolve the pathname `to` navigates to (query/hash changes only → same pathname). */
export function destinationPathname(from: Location, to: string): string {
  if (typeof window === "undefined") return from.pathname;
  return new URL(to, window.location.href).pathname;
}

/** Leaf branch key — mirrors BranchStack / Router branchKey. */
export function getBranchKey(
  matches: readonly { path: string }[],
  fallbackPathname: string,
): string {
  const leaf = matches[matches.length - 1];
  return leaf ? leaf.path : fallbackPathname;
}

/**
 * True when navigation stays on the same matched route leaf — pathname unchanged,
 * only search (or hash) differs. These swap in place with no leave/enter.
 */
export function isSameLeafNavigation(
  from: Location,
  to: string,
  currentBranchKey: string,
): boolean {
  return destinationPathname(from, to) === currentBranchKey;
}
