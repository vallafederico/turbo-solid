import { isServer } from "solid-js/web";
import { Subscribable } from "./subscribable";

function isMobile(): boolean {
	if (isServer) return false;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent,
	);
}

export interface ResizeData {
	width: number;
	height: number;
	top: number;
	left: number;
}

class _Resizer extends Subscribable<ResizeData> {
	isMobile = isMobile();
	private observer?: ResizeObserver;

	constructor() {
		super();
		if (!isServer) {
			this.observer = new ResizeObserver((entries: ResizeObserverEntry[]) =>
				this.onResize(entries),
			);
			this.observer.observe(document.body);
		}
	}

	onResize(entries: ResizeObserverEntry[]): void {
		this.isMobile = isMobile();
		this.notify(entries[0].contentRect);
	}

	dispose(): void {
		this.observer?.disconnect();
	}
}

export const Resizer = new _Resizer();
