export type ImageTransformOptions = {
	width?: number;
	height?: number;
	crop?: "center" | "top" | "bottom" | "left" | "right";
};

export function shopifyImageUrl(
	url: string,
	{ width, height, crop = "center" }: ImageTransformOptions = {},
): string {
	if (!url) return url;

	const parsed = new URL(url);

	if (width) parsed.searchParams.set("width", String(width));
	if (height) parsed.searchParams.set("height", String(height));
	if (width || height) parsed.searchParams.set("crop", crop);

	return parsed.toString();
}

export function buildSrcSet(
	url: string,
	widths: number[],
	options: Omit<ImageTransformOptions, "width"> = {},
): string {
	return widths
		.map((width) => `${shopifyImageUrl(url, { ...options, width })} ${width}w`)
		.join(", ");
}

export const DEFAULT_SRCSET_WIDTHS = [320, 640, 960, 1280, 1600];
