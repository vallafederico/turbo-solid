import { describe, expect, it } from "vitest";
import {
	shopifyRevalidatePaths,
	shopifyRouteRules,
	verifyRevalidationSecret,
} from "./solid-start";

describe("solid-start helpers", () => {
	it("returns ISR route rules on Vercel", () => {
		const rules = shopifyRouteRules({ preset: "vercel", ttl: 60 });
		expect(rules["/_/shop"]).toMatchObject({
			isr: { expiration: 60, allowQuery: ["collection", "sort", "after"] },
		});
		expect(rules["/_/shop/**"]).toMatchObject({ isr: { expiration: 60 } });
		expect(rules["/api/shopify/revalidate"]).toEqual({ isr: false });
	});

	it("maps product and collection handles to paths", () => {
		expect(
			shopifyRevalidatePaths({ product: "slides", collection: "men" }),
		).toEqual(["/_/shop", "/_/shop/slides", "/_/shop?collection=men"]);
	});

	it("verifies revalidation secret", () => {
		expect(verifyRevalidationSecret("mock-secret", "mock-secret")).toBe(true);
		expect(verifyRevalidationSecret("wrong", "mock-secret")).toBe(false);
	});
});
