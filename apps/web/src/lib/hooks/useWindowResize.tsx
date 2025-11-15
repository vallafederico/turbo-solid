import { type ResizeData, Resizer } from "@local/animation";
import { onCleanup, onMount } from "solid-js";

type ResizeCallback = (params: { width: number; height: number }) => void;

export const useWindowResize = (callback: ResizeCallback) => {
	const cb = (data: ResizeData) => {
		callback(data);
	};

	onMount(() => {
		Resizer.add(cb);
	});

	onCleanup(() => {
		Resizer.remove(cb);
	});
};
