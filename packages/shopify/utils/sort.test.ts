import { describe, expect, it } from "vitest";
import { toCollectionSortKey } from "./sort";

describe("toCollectionSortKey", () => {
	it("maps CREATED_AT to CREATED", () => {
		expect(toCollectionSortKey("CREATED_AT")).toBe("CREATED");
	});

	it("passes through shared enum values", () => {
		expect(toCollectionSortKey("PRICE")).toBe("PRICE");
		expect(toCollectionSortKey("BEST_SELLING")).toBe("BEST_SELLING");
	});

	it("falls back catalog-only keys to BEST_SELLING", () => {
		expect(toCollectionSortKey("PRODUCT_TYPE" as import("../types").ProductSortKey)).toBe(
			"BEST_SELLING",
		);
	});
});
