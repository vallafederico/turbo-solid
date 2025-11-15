import Lenis from "lenis";
import { isServer } from "solid-js/web";
import gsap from "../../gsap";
import { Subscribable } from "./subscribable";

export interface ScrollEvent {
	velocity: number;
	scroll: number;
	direction: 1 | -1;
	progress: number;
	glScroll: number;
}

export const scroll = (el: HTMLElement) => {
	Scroll.handleResize(el);
};

class _Scroll extends Subscribable<ScrollEvent> {
	previousHeight = 0;
	y = 0;
	lenis?: Lenis;
	private glPixelRatio?: number;

	constructor() {
		super();

		if (!isServer) {
			this.init();
		}
	}

	// Method to set GL pixel ratio for coordinate conversion
	setGlPixelRatio(pixelRatio: number) {
		this.glPixelRatio = pixelRatio;
	}

	// Getter for GL scroll value
	get gl(): number {
		const scroll = this.lenis?.scroll || 0;
		if (!this.glPixelRatio) {
			return scroll;
		}
		return scroll * this.glPixelRatio;
	}

	init(): void {
		this.y = window.scrollY || 0;
		const wrapper = document.querySelector("#app");
		this.lenis = new Lenis({
			wrapper: wrapper || window,
			autoResize: false,
		});

		this.lenis.on("scroll", this.onScroll.bind(this));
		gsap.ticker.add((time: number) => this.lenis!.raf(time * 1000));
	}

	handleResize(item: HTMLElement): void {
		new ResizeObserver(([entry]: ResizeObserverEntry[]) => {
			if (entry.contentRect.height !== this.previousHeight) {
				this.lenis?.resize();
				this.previousHeight = entry.contentRect.height;
			}
		}).observe(item);
	}

	get scrollEventData(): ScrollEvent {
		const scroll = this.lenis?.scroll || 0;

		return {
			velocity: this.lenis?.velocity || 0,
			scroll: scroll,
			direction: this.lenis?.direction || 1,
			progress: this.lenis?.progress || 0,
			glScroll: this.gl,
		};
	}

	onScroll({ velocity, scroll, direction, progress }: any): void {
		this.y = this.gl;

		this.notify({ velocity, scroll, direction, progress, glScroll: this.gl });
	}

	to(params: any): void {
		this.lenis?.scrollTo(params);
	}

	destroy(): void {
		this.lenis?.destroy();
	}
}

export const Scroll = new _Scroll();
