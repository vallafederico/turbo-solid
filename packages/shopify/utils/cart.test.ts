import { describe, expect, it } from "vitest";
import type { CartLine } from "../types";
import { lineCompareAtTotal, lineOptionsLabel, lineTotal } from "./cart";

function makeLine(overrides: Partial<CartLine> = {}): CartLine {
	return {
		id: "line-1",
		quantity: 2,
		cost: {
			totalAmount: { amount: "50.0", currencyCode: "USD" },
			amountPerQuantity: { amount: "25.0", currencyCode: "USD" },
			compareAtAmountPerQuantity: null,
		},
		merchandise: {
			id: "v1",
			title: "Small",
			availableForSale: true,
			price: { amount: "25.0", currencyCode: "USD" },
			selectedOptions: [{ name: "Size", value: "Small" }],
			product: { title: "Slides", handle: "slides" },
		},
		...overrides,
	};
}

describe("lineTotal", () => {
	it("uses cost.totalAmount when present", () => {
		expect(lineTotal(makeLine()).amount).toBe("50.0");
	});

	it("falls back to unit price when cost is missing", () => {
		const line = makeLine({ cost: undefined });
		expect(lineTotal(line).amount).toBe("25.0");
	});
});

describe("lineCompareAtTotal", () => {
	it("returns undefined when there is no compare-at price", () => {
		expect(lineCompareAtTotal(makeLine())).toBeUndefined();
	});

	it("returns undefined when compare-at is not higher than unit price", () => {
		const line = makeLine({
			cost: {
				totalAmount: { amount: "50.0", currencyCode: "USD" },
				amountPerQuantity: { amount: "25.0", currencyCode: "USD" },
				compareAtAmountPerQuantity: { amount: "25.0", currencyCode: "USD" },
			},
		});
		expect(lineCompareAtTotal(line)).toBeUndefined();
	});

	it("multiplies per-unit compare-at by quantity", () => {
		const line = makeLine({
			cost: {
				totalAmount: { amount: "50.0", currencyCode: "USD" },
				amountPerQuantity: { amount: "25.0", currencyCode: "USD" },
				compareAtAmountPerQuantity: { amount: "40.0", currencyCode: "USD" },
			},
		});
		const result = lineCompareAtTotal(line);
		expect(result?.amount).toBe("80");
		expect(result?.currencyCode).toBe("USD");
	});
});

describe("lineOptionsLabel", () => {
	it("joins selected option values", () => {
		const line = makeLine({
			merchandise: {
				...makeLine().merchandise,
				selectedOptions: [
					{ name: "Size", value: "Small" },
					{ name: "Color", value: "Green" },
				],
			},
		});
		expect(lineOptionsLabel(line)).toBe("Small / Green");
	});

	it("falls back to variant title when no selected options", () => {
		const line = makeLine({
			merchandise: { ...makeLine().merchandise, selectedOptions: [] },
		});
		expect(lineOptionsLabel(line)).toBe("Small");
	});
});
