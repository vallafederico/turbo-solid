import { onCleanup, onMount } from "solid-js";
import { type ResizeData, Resizer } from "~/lib/utils/resizer";

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
