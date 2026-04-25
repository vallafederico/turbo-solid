import { Gl } from "../gl";

/**
 * Shared by Solid and React wrappers: attach a DOM-linked WebGL node to the scene.
 */
export function createWebGlNode(
  self: HTMLElement,
  webglNode: new (el: HTMLElement) => {
    dispose?: () => void;
    inView?: boolean;
  },
  attachTo: object | null | undefined = null,
) {
  if (!webglNode) return;
  const target = (attachTo ?? Gl.scene) as
    | { add?: (o: unknown) => void }
    | null
    | undefined;
  if (!target || typeof target.add !== "function") {
    if (typeof window !== "undefined") {
      console.warn(
        "[@local/three] createWebGlNode: attach target missing (Gl.start not finished yet). " +
          "Hooks use runWhenAttachTargetReady; call this only when the scene exists.",
      );
    }
    return undefined;
  }

  const it = new webglNode(self);
  target.add(it);
  return it;
}
