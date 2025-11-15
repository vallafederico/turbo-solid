import { Scroll } from "../subscribers/scroll";

interface ClientRectBounds {
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
