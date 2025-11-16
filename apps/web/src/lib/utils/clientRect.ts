import { Scroll, viewport } from "@local/animation";
import { Gl } from "~/gl/gl";

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

export const clientRect = (element: HTMLElement): ClientRectBounds => {
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

export const clientRectGl = (element: HTMLElement): ClientRectGlBounds => {
	const bounds = clientRect(element);

	bounds.centerx = -Gl.vp.w / 2 + bounds.left + bounds.width / 2;
	bounds.centery = Gl.vp.h / 2 - bounds.top - bounds.height / 2;

	for (const [key, value] of Object.entries(bounds)) {
		bounds[key as keyof ClientRectGlBounds] = value * Gl.vp.px;
	}

	return bounds as ClientRectGlBounds;
};
