/**
 * Same contract as the Solid `setWebgl` store for `@local/gl-context` / `Scene.load`.
 */
export const webgl = {
  loaded: false,
};

export function setWebgl(patch: { loaded?: boolean }): void {
  Object.assign(webgl, patch);
}
