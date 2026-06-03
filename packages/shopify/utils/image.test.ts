import { describe, expect, it } from "vitest";
import { buildSrcSet, shopifyImageUrl } from "../utils/image";

describe("image utils", () => {
	it("appends Shopify CDN transform params", () => {
		const url = shopifyImageUrl("https://cdn.shopify.com/image.jpg?v=1", {
			width: 640,
			height: 640,
			crop: "center",
		});

		expect(url).toContain("width=640");
		expect(url).toContain("height=640");
		expect(url).toContain("crop=center");
	});

	it("builds srcset widths", () => {
		const srcset = buildSrcSet("https://cdn.shopify.com/image.jpg?v=1", [
			320, 640,
		]);
		expect(srcset).toContain("320w");
		expect(srcset).toContain("640w");
	});
});
