import { onCleanup, onMount } from "solid-js";

export function useKeypress(key: string, callback: (e: KeyboardEvent) => void) {
	const handler = (e: KeyboardEvent) => {
		if (e.key === key) {
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
