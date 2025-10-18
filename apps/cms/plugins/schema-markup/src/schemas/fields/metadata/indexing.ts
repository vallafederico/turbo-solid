import { defineField } from "sanity";
import IndexingControls from "../../../components/core/IndexingControls/IndexingControls";

export default defineField({
	name: "searchVisibility",
	title: "Search Visibility",
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
