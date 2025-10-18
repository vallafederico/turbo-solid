// utils/image.ts
import { urlFor } from "@local/sanity";
import type { SanityImageAssetDocument } from "@sanity/client";

export type SanityImageObject = {
	asset?:
		| {
				_ref?: string;
				_id?: string;
				url?: string;
		  }
		| SanityImageAssetDocument;
};

export type ImageSource = string | SanityImageObject | { url: string };

/**
 * Resolve a Sanity image object to a URL string
 * Handles multiple input formats:
 * - Plain URL strings
 * - Objects with { url: string }
 * - Sanity image objects with asset references
 */
export function resolveImageUrl(
	image?: ImageSource,
	fallback?: ImageSource,
): string | undefined {
	const resolved = resolveImage(image) || resolveImage(fallback);
	return resolved;
}

function resolveImage(image?: ImageSource): string | undefined {
	if (!image) return undefined;

	// Already a URL string
	if (typeof image === "string") {
		return image;
	}

	// Object with url property
	if (typeof image === "object" && "url" in image && image.url) {
		return image.url;
	}

	// Sanity image object with asset reference
	if (typeof image === "object" && "asset" in image && image.asset) {
		const asset = image.asset;

		// Asset already has url
		if (typeof asset === "object" && "url" in asset && asset.url) {
			return asset.url;
		}

		// Asset has _ref or _id, use urlFor to build URL
		if (typeof asset === "object" && ("_ref" in asset || "_id" in asset)) {
			try {
				// Build the URL using Sanity's image URL builder
				// @ts-expect-error - urlFor accepts flexible image types
				const builder = urlFor(image);
				return builder.url();
			} catch (err) {
				console.warn("Failed to resolve Sanity image URL:", err);
				return undefined;
			}
		}
	}

	return undefined;
}

/**
 * Create a schema-compatible image object from various sources
 * Returns an object with a url property suitable for schema markup
 */
export function createSchemaImage(
	image?: ImageSource,
	fallback?: ImageSource,
): { url: string } | undefined {
	const url = resolveImageUrl(image, fallback);
	return url ? { url } : undefined;
}
