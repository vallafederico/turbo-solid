// src/components/SanityVisualEditing.tsx
import { onMount, onCleanup, Show } from "solid-js";
import { enableVisualEditing } from "@sanity/visual-editing";

function startVisualEditing(opts?: { history?: any; zIndex?: number }) {
	const disable = enableVisualEditing(opts);
	// return a cleanup function
	return () => {
		disable?.();
	};
}

export default function SanityVisualEditing(props: { enabled: boolean }) {
	let cleanup: (() => void) | undefined;

	onMount(() => {
		if (props.enabled) {
			console.log("starting visual editing");
			cleanup = startVisualEditing({
				// optional: provide router sync logic
				history: {
					subscribe: (fn) => {
						const handler = () =>
							fn({
								type: "push",
								url: window.location.pathname + window.location.search,
							});
						window.addEventListener("popstate", handler);
						return () => window.removeEventListener("popstate", handler);
					},
					update: (update) => {
						switch (update.type) {
							case "push":
								return window.history.pushState(null, "", update.url);
							case "replace":
								return window.history.replaceState(null, "", update.url);
							case "pop":
								return window.history.back();
						}
					},
				},
				// optionally set zIndex
				zIndex: 1000,
			});
		}
	});

	onCleanup(() => {
		cleanup?.();
	});

	return (
		<Show when={true}>
			{/* nothing to render — overlays mount automatically */}
		</Show>
	);
}
