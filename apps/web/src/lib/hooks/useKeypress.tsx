import { onCleanup, onMount } from "solid-js";

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
			(options.shift === undefined || options.shift === e.shiftKey) &&
		) {
			callback(e);
		}
	};

	onMount(() => {
		window.addEventListener("keydown", handler);
	});

	onCleanup(() => {
		window.removeEventListener("keydown", handler);
	});
}
