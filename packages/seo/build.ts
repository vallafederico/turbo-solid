import { mergeSeoData } from "./utils/merge";

// seo/build.ts
export function buildSeoPayload({
	globalDefaults,
	typeDefaults,
	pageSeo,
	pageSchemaType,
	extraSchemaData,
}: {
	globalDefaults: SeoData;
	typeDefaults?: SeoData;
	pageSeo?: SeoData;
	pageSchemaType?: string;
	extraSchemaData?: Record<string, any>;
}) {
	const merged = mergeSeoData(
		globalDefaults,
		typeDefaults || {},
		pageSeo || {},
	);

	const schema = composeSchema({
		seo: merged,
		type: pageSchemaType || "webpage",
		extra: extraSchemaData,
	});

	return {
		meta: merged,
		schema,
	};
}
