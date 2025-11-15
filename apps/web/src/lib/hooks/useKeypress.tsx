import { onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

type KeypressOptions = {
	ctrl?: boolean;
	alt?: boolean;
	shift?: boolean;
};

export function useKeypress(
	key: string,
	callback: (e: KeyboardEvent) => void,
	options: KeypressOptions = {},
) {
	const handler = (e: KeyboardEvent) => {
		if (
			e.key === key &&
			(options.ctrl === undefined || options.ctrl === e.ctrlKey) &&
			(options.alt === undefined || options.alt === e.altKey) &&
			(options.shift === undefined || options.shift === e.shiftKey)
		) {
			callback(e);
		}
	};

	onMount(() => {
		if (isServer) return;
		window.addEventListener("keydown", handler);
	});

	onCleanup(() => {
		if (isServer) return;
		window.removeEventListener("keydown", handler);
	});
}
