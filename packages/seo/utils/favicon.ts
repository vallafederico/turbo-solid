import type { SanityAssetDocument } from "@sanity/client";
import sanityClient from "../../sanity/client";
import { urlFor } from "../../sanity/utils/assets";

export type Favicon = {
	type: string;
	sizes?: string;
	href: string;
};

export const createFavicons = (
	favicon: SanityAssetDocument | undefined,
): Favicon[] | null => {
	if (!favicon?.asset) return null;

	const favicons: Favicon[] = [];
	const imageRef = favicon.asset._ref || favicon.asset._id;
	const [assetType, id, dimensions, fileType] = imageRef.split("-");

	if (fileType === "svg") {
		const svg = urlFor(imageRef).url();
		const pngFallback = urlFor(imageRef).size(32, 32).format("png").url();

		favicons.push(
			{
				type: "image/svg+xml",
				href: svg,
			},
			{
				type: "image/png",
				sizes: "32x32",
				href: pngFallback,
			},
		);
	}

	return favicons;
};
