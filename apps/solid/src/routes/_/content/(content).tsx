import { SLICE_LIST } from "~/components/slices";

import {
	SanityPage,
	getDocumentByType,
	TextInput,
	SelectInput,
	TextareaInput,
	SanityComponents,
	useLiveQuery,
	getDocByType,
} from "@local/sanity";

import { createAsync, query } from "@solidjs/router";
import { animateAlpha } from "~/animation/alpha";

// Server-side: the Sanity client is configured with a server-only token, so a
// browser-side call would fetch unauthenticated and miss the drafts perspective.
const getHomeDoc = query(async () => {
	"use server";
	return getDocByType("home");
}, "content-home-doc");

export default function Content() {
	const ssr = createAsync(() => getHomeDoc()); // { data, query, params }

	// // Start overlays when in preview (needs react@18 + react-dom@18 installed)
	// onMount(() => {
	// 	if (isPreview()) enableVisualEditing();
	// });

	// Live updates: reuse SSR's exact GROQ + params via accessors
	const live = useLiveQuery(
		() => ssr()?.query!, // same GROQ string
		{
			initial: () => ssr ?? null,
			params: () => {}, // { id }
			onError: (e) => console.error(e),
		},
	);

	const post = () => live.data() ?? ssr()?.data;

	return (
		<SanityPage fetcher={post}>
			{(data) => {
				return (
					<>
						<div use:animateAlpha>
							<SanityComponents
								components={data.slices}
								componentList={SLICE_LIST}
							/>
						</div>
						<div class="h-[300svh] border-b"></div>
					</>
				);
			}}
		</SanityPage>
	);
}
