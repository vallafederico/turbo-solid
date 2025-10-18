import type { WebSite } from "schema-dts";
import { createAsync } from "@solidjs/router";
import { getDocumentByType } from "@local/sanity";
import { buildWebPageSchema } from "./utils/webpage";
import { Show } from "solid-js";
import { createMetaTitle } from "../utils/meta-title";
import { mergeSeoData } from "../utils/merge";

export default function SchemaMarkup({
	schemaMarkup,
	title,
	_createdAt,
	_updatedAt,
}: {
	data: any;
	title: string;
	_createdAt: string;
	_updatedAt: string;
}) {
	const defaults = createAsync(() => {
		return Promise.all([
			getDocumentByType("schemaMarkupDefaults"),
			getDocumentByType("seoDefaults"),
		]);
	});
	// const seoDefaults = createAsync(() => getDocumentByType("seoDefaults"));

	const schemaGenerators = {
		WebPage: buildWebPageSchema,
	};

	return (
		<Show when={defaults()}>
			{(data) => {
				const [schemaMarkupDefaults, seoDefaults] = data();
				const mergedMetadata = mergeSeoData(data, seoDefaults);
				const metaTitle = createMetaTitle(
					title,
					seoDefaults?.siteTitle,
					seoDefaults?.pageTitleTemplate,
				);

				return (
					<script type="application/ld+json">
						{JSON.stringify(
							schemaGenerators?.[
								schemaMarkup.type as keyof typeof schemaGenerators
							]?.({
								...schemaMarkupDefaults,
								...seoDefaults,
								...data,
								title: metaTitle,
							}),
						)}
					</script>
				);
			}}
		</Show>
	);
}
