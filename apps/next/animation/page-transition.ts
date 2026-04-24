export const SCROLL_OFFSET = -48;

const outTransitions = new Set<() => void | Promise<void>>();

export function setOutTransition(fn: () => void | Promise<void>): () => void {
  outTransitions.add(fn);
  return () => outTransitions.delete(fn);
}

export function resetOutTransitions(): void {
  outTransitions.clear();
}

export async function animateOut(): Promise<void> {
  if (outTransitions.size === 0) return;

  await Promise.all(
    Array.from(outTransitions, (fn) => Promise.resolve(fn())),
  );
  resetOutTransitions();
}
