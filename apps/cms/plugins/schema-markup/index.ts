import { definePlugin } from "sanity";
import entities from "./src/schemas/entities";
import global from "./src/schemas/global";
import fieldGroups from "./src/schemas/fields";

import { schemaMarkupDefaults } from "./src/schemas/singleton/schema-defaults";
import singleton from "./src/schemas/singleton";

export const schemaMarkupPlugin = definePlugin({
	name: "schema-markup",
	schema: {
		types: [...fieldGroups, ...global, ...entities, ...singleton],
	},
});
