import { isServer } from "solid-js/web";
import gsap from "~/lib/gsap";
import { Subscribable } from "./subscribable";

class _Raf extends Subscribable<number> {
	constructor() {
		super();

		if (!isServer) {
			this.init();
		}
	}

	init(): void {
		gsap.ticker.add((time: number) => this.render(time * 1000));
	}

	render(t: number): void {
		this.notify(t);
	}
}

export const Raf = new _Raf();
