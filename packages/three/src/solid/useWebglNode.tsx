import { onMount, onCleanup, createSignal, createEffect } from "solid-js";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";

import { mountWebglNode } from "../core/mountWebglNode";

export const useWebglNode = (
	classToInstantiate: any,
	sceneToAttachTo: any = null,
) => {
	const vo = createVisibilityObserver({ threshold: 0 });

	const [ref, setRef] = createSignal<HTMLElement | null>(null);
	const [node, setNode] = createSignal<any>(null);

	let mounted: ReturnType<typeof mountWebglNode> | undefined;

	onMount(() => {
		if (!ref()) return;
		const r = ref()!;
		const visible = vo(r);

		mounted = mountWebglNode({
			el: r,
			classToInstantiate,
			attachTo: sceneToAttachTo,
			getInView: () => !!visible(),
			onNode: setNode,
		});

		createEffect(() => {
			mounted?.setInView(!!visible());
		});
	});

	onCleanup(() => {
		mounted?.dispose();
	});

	return { setRef, ref, node };
};
