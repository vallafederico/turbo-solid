import { Gl } from "~/app/gl/gl";
import { Scroll } from "../../app/scroll";
import { viewport } from "~/lib/stores/viewportStore";

export const clientRect = (element) => {
  const bounds = element.getBoundingClientRect();
  const { scroll } = Scroll.lenis;

  return {
    // screen
    top: bounds.top + scroll,
    bottom: bounds.bottom + scroll,
    width: bounds.width,
    height: bounds.height,
    left: bounds.left,
    right: bounds.right,
    wh: viewport.size.height,
    ww: viewport.size.width,
    offset: bounds.top + scroll,
  };
};

// (*) check the scroll part

export const clientRectGl = (element) => {
  const bounds = clientRect(element);

  bounds.centerx = -Gl.vp.w / 2 + bounds.left + bounds.width / 2;
  bounds.centery = Gl.vp.h / 2 - bounds.top - bounds.height / 2;

  for (const [key, value] of Object.entries(bounds))
    bounds[key] = value * Gl.vp.px;

  return bounds;
};
