// utils/image.ts
import { urlFor } from "@local/sanity";
import type { SanityImageAssetDocument } from "@sanity/client";
import type { ImageObject } from "schema-dts";

const formatImageUrl = (imageReference: string): ImageObject => {
	if (!imageReference)
		return { url: undefined, width: undefined, height: undefined };

	const MAX_WIDTH = 2000;
	const QUALITY = 85;

	const [_, id, dimensions, _fileType] = imageReference.split("-");
	const [width, height] = dimensions.split("x").map(Number);
	const aspectRatio = Number(width) / Number(height);

	let w = width;
	let h = height;

	const shouldClamp = width > MAX_WIDTH;
	if (shouldClamp) {
		const newWidth = Math.min(width, MAX_WIDTH);
		const newHeight = Math.round(newWidth / aspectRatio);

		w = newWidth;
		h = newHeight;

		return {
			url: urlFor(imageReference)
				.size(newWidth, newHeight)
				.quality(QUALITY)
				.url(),
			width: newWidth,
			height: newHeight,
		};
	}

	return {
		url: urlFor(imageReference).quality(QUALITY).url(),
		width: w,
		height: h,
	};
};

export function createSchemaImageObject(
	image?: SanityImageAssetDocument,
	fallback?: SanityImageAssetDocument,
): ImageObject | undefined {
	if (!image && !fallback) return undefined;
	const imageToUse = image || fallback;

	const isDereferencedImage =
		typeof imageToUse === "object" && "asset" in imageToUse && imageToUse.asset;
	const reference = isDereferencedImage
		? imageToUse.asset?._id
		: imageToUse?.asset?._ref;

	return { "@type": "ImageObject", ...formatImageUrl(reference || "") };
}
