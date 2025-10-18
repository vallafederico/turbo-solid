import sanityClient from "../../sanity/client";
import { urlFor } from "../../sanity/utils/assets";

const createFavicons = (favicon) => {
	if (!favicon || !favicon.url) return [];

	const imageUrl = urlFor(favicon.asset._ref).url();

	console.log(imageUrl);

	return null;

	// const isSvg =
	// 	favicon.mimeType === "image/svg+xml" ||
	// 	(favicon.extension && favicon.extension.toLowerCase() === "svg");

	// const baseUrl = favicon.url.split("?")[0];

	// if (isSvg) {
	// 	return [
	// 		// PNG at 32x32
	// 		{
	// 			rel: "icon",
	// 			type: "image/png",
	// 			sizes: "32x32",
	// 			href: `${baseUrl}?w=32&h=32&fit=crop&fm=png`,
	// 		},
	// 		// SVG favicon
	// 		{
	// 			rel: "icon",
	// 			type: "image/svg+xml",
	// 			href: baseUrl,
	// 		},
	// 		// Apple touch icon 180x180 PNG
	// 		{
	// 			rel: "apple-touch-icon",
	// 			sizes: "180x180",
	// 			href: `${baseUrl}?w=180&h=180&fit=crop&fm=png`,
	// 		},
	// 	];
	// } else {
	// 	return [
	// 		// Only PNG at 32x32
	// 		{
	// 			rel: "icon",
	// 			type: "image/png",
	// 			sizes: "32x32",
	// 			href: `${baseUrl}?w=32&h=32&fit=crop&fm=png`,
	// 		},
	// 	];
	// }
};
