import {
	getDocumentByType,
	SanityComponents,
	SanityPage,
	SelectInput,
	TextareaInput,
	TextInput,
	useLiveQuery,
} from "@local/sanity";
import { createAsync } from "@solidjs/router";
import { animateAlpha } from "~/animation/alpha";
import { SLICE_LIST } from "~/components/slices";

const getContent = async () => {
	"use server";
	return getDocumentByType("home");
};

export default function Content() {
	const ssr = createAsync(() => getContent()); // { data, query, params }

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
