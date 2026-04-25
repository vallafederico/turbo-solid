import { Gl } from "@local/three/gl";
import { Scroll } from "@/lib/scroll";

export interface ClientRectBounds {
  top: number;
  bottom: number;
  width: number;
  height: number;
  left: number;
  right: number;
  wh: number;
  ww: number;
  offset: number;
}

export interface ClientRectGlBounds extends ClientRectBounds {
  centerx: number;
  centery: number;
}

function clientRect(element: HTMLElement): ClientRectBounds {
  const bounds = element.getBoundingClientRect();
  const scroll = Scroll.lenis?.scroll ?? 0;

  return {
    top: bounds.top + scroll,
    bottom: bounds.bottom + scroll,
    width: bounds.width,
    height: bounds.height,
    left: bounds.left,
    right: bounds.right,
    wh:
      typeof window !== "undefined" ? window.innerHeight : 0,
    ww:
      typeof window !== "undefined" ? window.innerWidth : 0,
    offset: bounds.top + scroll,
  };
}

export function clientRectGl(element: HTMLElement): ClientRectGlBounds {
  const bounds = { ...clientRect(element) } as ClientRectGlBounds & Record<string, number>;

  bounds.centerx = -Gl.vp.w / 2 + bounds.left + bounds.width / 2;
  bounds.centery = Gl.vp.h / 2 - bounds.top - bounds.height / 2;

  for (const [key, value] of Object.entries(bounds)) {
    (bounds as Record<string, number>)[key] = value * Gl.vp.px;
  }

  return bounds;
}
