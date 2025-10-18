import { Title } from "@solidjs/meta";
import { SanityMeta, SchemaMarkup } from "@local/seo";
import { createAsync } from "@solidjs/router";
import { getDocumentByType } from "@local/sanity";
import { Show } from "solid-js";

export default function Home() {
	const pageData = createAsync(() => getDocumentByType("home"));

	return (
		<div class="min-h-[100vh] pt-20">
			<Show when={pageData()}>{(data) => <SanityMeta {...data()} />}</Show>
		</div>
	);
}
