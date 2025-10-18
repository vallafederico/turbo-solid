import { definePlugin } from "sanity";
import entities from "./src/schemas/entities";
import global from "./src/schemas/global";
import fieldGroups from "./src/schemas/fields";

import singleton from "./src/schemas/singleton";
import SeoLayoutWrapper from "./src/components/core/SeoLayoutWrapper";

export const schemaMarkupPlugin = definePlugin({
	name: "crawl-me-maybe",

	schema: {
		types: [...fieldGroups, ...global, ...entities, ...singleton],
	},
	studio: {
		components: {
			layout: SeoLayoutWrapper,
		},
	},
});
