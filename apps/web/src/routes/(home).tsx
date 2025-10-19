// import { SanityMeta } from "@local/seo";

import { createAsync, query } from "@solidjs/router";
import { getDocumentByType } from "@local/sanity";
import { Title } from "@solidjs/meta";
import { SanityMeta } from "@local/seo";

const getHomeData = query(async () => {
	"use server";
	return getDocumentByType("home");
}, "home-data");

export const route = {
	preload: () => getHomeData(),
};

export default function Home() {
	// Using query + createAsync ensures data is available during SSR
	const data = createAsync(() => getHomeData(), { deferStream: true });

	return (
		<div class="min-h-[100vh] pt-20">
			<SanityMeta isHomepage={true} pageData={data()} />
		</div>
	);
}
