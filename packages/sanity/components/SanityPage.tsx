import type { SanityDocumentStub } from "@sanity/client";
import { createEffect, Show, Suspense } from "solid-js";
import type { JSX } from "solid-js";

interface SanityPageProps {
	children: (data: SanityDocumentStub) => JSX.Element;
	fetcher?: any;
	class?: string;
}

export default function SanityPage({
	children,
	fetcher = () => {},
	class: className,
}: SanityPageProps) {
	// console.log(fetcher());

	return (
		<div class={`min-h-screen ${className}`}>
			<Show when={fetcher()}>{children(fetcher())}</Show>
		</div>
	);
}
