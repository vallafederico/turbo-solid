import { defineField } from "sanity";
import IndexingControls from "../../../components/core/IndexingControls/IndexingControls";

export default defineField({
	name: "indexing",
	title: "Indexing Controls",
	type: "object",
	components: {
		input: IndexingControls,
	},
	fields: [
		{
			name: "noFollow",
			title: "No Follow",
			type: "boolean",
		},
		{
			name: "noIndex",
			title: "No Index",
			type: "boolean",
		},
	],
});
