import { splitProps, type JSX } from "solid-js";
import {
	buildSrcSet,
	DEFAULT_SRCSET_WIDTHS,
	shopifyImageUrl,
} from "../utils/image";
import type { ShopifyImage as ShopifyImageType } from "../types";

export type ShopifyImageProps = {
	image?: ShopifyImageType | null;
	alt?: string;
	width?: number;
	height?: number;
	sizes?: string;
	priority?: boolean;
	class?: string;
	widths?: number[];
} & JSX.ImgHTMLAttributes<HTMLImageElement>;

export default function ShopifyImage(allProps: ShopifyImageProps) {
	const [local, props] = splitProps(allProps, [
		"image",
		"alt",
		"width",
		"height",
		"sizes",
		"priority",
		"class",
		"widths",
	]);

	const image = () => local.image;
	const altText = () => image()?.altText || local.alt || "";
	const intrinsicWidth = () =>
		local.width ?? image()?.width ?? DEFAULT_SRCSET_WIDTHS[0];
	const intrinsicHeight = () => {
		const width = intrinsicWidth();
		const img = image();
		if (local.height) return local.height;
		if (img?.width && img?.height) {
			return Math.round((width / img.width) * img.height);
		}
		return width;
	};

	const src = () => {
		const url = image()?.url;
		if (!url) return "";
		return shopifyImageUrl(url, { width: intrinsicWidth() });
	};

	const srcSet = () => {
		const url = image()?.url;
		if (!url) return undefined;
		return buildSrcSet(url, local.widths ?? DEFAULT_SRCSET_WIDTHS);
	};

	return (
		<img
			{...props}
			class={local.class}
			src={src()}
			srcset={srcSet()}
			width={intrinsicWidth()}
			height={intrinsicHeight()}
			alt={altText()}
			sizes={local.sizes ?? "(max-width: 767px) 100vw, 50vw"}
			loading={local.priority ? "eager" : "lazy"}
			decoding={local.priority ? "sync" : "async"}
			fetchpriority={local.priority ? "high" : "auto"}
		/>
	);
}
