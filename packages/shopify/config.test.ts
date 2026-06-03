import { describe, expect, it } from "vitest";
import { resolveEndpoint } from "./config";

describe("resolveEndpoint", () => {
	it("uses mock.shop public API without token path", () => {
		expect(resolveEndpoint("mock.shop", "2025-01")).toBe("https://mock.shop/api");
	});

	it("builds real Shopify Storefront endpoint", () => {
		expect(resolveEndpoint("example.myshopify.com", "2025-01")).toBe(
			"https://example.myshopify.com/api/2025-01/graphql.json",
		);
	});
});
