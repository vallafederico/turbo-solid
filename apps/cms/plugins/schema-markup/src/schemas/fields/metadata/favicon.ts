import { defineField } from "sanity";
import FaviconPreview from "../../../components/core/Favicon/FaviconPreview";

export default defineField({
	name: "favicon",
	type: "image",
	components: {
		input: FaviconPreview,
	},
	description:
		"The favicon of the site. To create the sharpest fallback images possible, use an SVG. Careful with transparent backgrounds, a user might have light or dark mode enabled.",
	group: "metadata",
});
