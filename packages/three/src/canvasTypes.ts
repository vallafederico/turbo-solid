/**
 * Shared by `@local/three/solid` and `@local/three/react` — host-injected app utilities (`@local/gl-context` contract).
 */
export interface CanvasDeps {
  gsap: any;
  Gui: any;
  lerp: (a: number, b: number, t: number) => number;
  Scroll: any;
  Resizer: any;
  setWebgl: (v: any) => void;
  assets: any;
  clientRectGl: (el: HTMLElement) => any;
}

export interface SolidCanvasProps {
  deps: CanvasDeps;
  class?: string;
}
