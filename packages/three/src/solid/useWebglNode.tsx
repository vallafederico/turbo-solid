import { onMount, onCleanup, createSignal, createEffect } from "solid-js";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";

import { createWebGlNode } from "../core/createWebGlNode";
import { runWhenAttachTargetReady } from "../core/runWhenAttachTargetReady";

export const useWebglNode = (
	classToInstantiate: any,
	sceneToAttachTo: any = null,
) => {
	const vo = createVisibilityObserver({ threshold: 0 });

	const [ref, setRef] = createSignal<HTMLElement | null>(null);
	const [node, setNode] = createSignal<any>(null);

	let cancelWait: (() => void) | undefined;

	onMount(() => {
		if (!ref()) return;
		const r = ref()!;
		const visible = vo(r);

		cancelWait = runWhenAttachTargetReady(
			sceneToAttachTo,
			() => {
				const n = createWebGlNode(r, classToInstantiate, sceneToAttachTo);
				if (n) setNode(n);
			},
		);

		createEffect(() => {
			const n = node();
			if (!n) return;
			n.inView = !!visible();
		});
	});

	onCleanup(() => {
		cancelWait?.();
		if (node() && node().dispose) node().dispose();
	});

	return { setRef, ref, node };
};
