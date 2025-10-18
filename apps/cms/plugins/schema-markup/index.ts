import { definePlugin } from "sanity";
import entities from "./src/schemas/entities";
import global from "./src/schemas/global";
import fieldGroups from "./src/schemas/fields";

export const schemaMarkupPlugin = definePlugin({
	name: "schema-markup",
	schema: {
		types: [...fieldGroups, ...global, ...entities],
	},
});
