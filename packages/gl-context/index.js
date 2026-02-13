/**
 * Shared context for WebGL. The host app sets these before starting Gl;
 * @local/three imports Scroll, Resizer, etc. directly from here.
 */
let gsap = null;
let Gui = null;
let lerp = null;
let Scroll = null;
let Resizer = null;
let setWebgl = null;
let assets = null;
let clientRectGl = null;

export function setGlContext(deps) {
  if (deps.gsap !== undefined) gsap = deps.gsap;
  if (deps.Gui !== undefined) Gui = deps.Gui;
  if (deps.lerp !== undefined) lerp = deps.lerp;
  if (deps.Scroll !== undefined) Scroll = deps.Scroll;
  if (deps.Resizer !== undefined) Resizer = deps.Resizer;
  if (deps.setWebgl !== undefined) setWebgl = deps.setWebgl;
  if (deps.assets !== undefined) assets = deps.assets;
  if (deps.clientRectGl !== undefined) clientRectGl = deps.clientRectGl;
}

export { gsap, Gui, lerp, Scroll, Resizer, setWebgl, assets, clientRectGl };
