import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Gl } from "~/gl/gl";

// (*) prevent recreation if one with same id already exists

export function createWebGlNode(
	self: HTMLElement,
	webglNode: any,
	attachTo: any = null,
) {
	if (!webglNode) return;
	if (!attachTo) attachTo = Gl.scene;

	const it = new webglNode(self);
	attachTo.add(it);
	return it;
}

export const useWebglNode = (
	classToInstantiate: any,
	sceneToAttachTo: any = null,
) => {
	const vo = createVisibilityObserver({ threshold: 0 });

	const [ref, setRef] = createSignal<HTMLElement | null>(null);
	const [node, setNode] = createSignal<any>(null);

	onMount(() => {
		if (!ref()) return;
		const visible = vo(ref());

		setNode(createWebGlNode(ref(), classToInstantiate, sceneToAttachTo));

		createEffect(() => {
			if (visible()) {
				node().inView = true;
			} else if (!visible()) {
				node().inView = false;
			}
		});
	});

	onCleanup(() => {
		if (node() && node().dispose) node().dispose();
	});

	return { setRef, ref, node };
};
