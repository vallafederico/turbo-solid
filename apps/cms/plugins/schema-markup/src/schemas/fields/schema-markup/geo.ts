import { defineType } from "sanity";

export const schemaMarkupGeo = defineType({
	name: "schemaMarkupGeo",
	title: "Geo Coordinates",
	type: "object",
	options: { collapsible: true, collapsed: true, columns: 2 },
	fields: [
		{ name: "latitude", type: "number", validation: (r) => r.min(-90).max(90) },
		{
			name: "longitude",
			type: "number",
			validation: (r) => r.min(-180).max(180),
		},
	],
	preview: {
		select: { lat: "latitude", lon: "longitude" },
		prepare: ({ lat, lon }) => ({
			title:
				lat && lon ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : "Geo Coordinates",
		}),
	},
});
