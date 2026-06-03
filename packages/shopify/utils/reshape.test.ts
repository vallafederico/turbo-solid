import { describe, expect, it } from "vitest";
import {
	flattenConnection,
	normalizePageInfo,
	reshapeConnection,
	reshapeCart,
} from "../utils/reshape";

describe("reshape utils", () => {
	it("flattens edge connections", () => {
		const nodes = flattenConnection({
			edges: [{ node: { id: "1" } }, { node: { id: "2" } }],
		});
		expect(nodes).toEqual([{ id: "1" }, { id: "2" }]);
	});

	it("flattens node connections", () => {
		const nodes = flattenConnection({
			nodes: [{ id: "a" }, { id: "b" }],
		});
		expect(nodes).toEqual([{ id: "a" }, { id: "b" }]);
	});

	it("normalizes page info defaults", () => {
		expect(normalizePageInfo()).toEqual({
			hasNextPage: false,
			endCursor: null,
		});
	});

	it("reshapes connections with page info", () => {
		expect(
			reshapeConnection({
				edges: [{ node: { id: "1" } }],
				pageInfo: { hasNextPage: true, endCursor: "abc" },
			}),
		).toEqual({
			nodes: [{ id: "1" }],
			pageInfo: { hasNextPage: true, endCursor: "abc" },
		});
	});

	it("reshapes cart line nodes", () => {
		const cart = reshapeCart({
			id: "cart-1",
			checkoutUrl: "https://example.com",
			totalQuantity: 1,
			cost: {
				subtotalAmount: { amount: "10", currencyCode: "CAD" },
				totalAmount: { amount: "10", currencyCode: "CAD" },
			},
			lines: {
				nodes: [
					{
						id: "line-1",
						quantity: 1,
						merchandise: { id: "v1", title: "Variant", availableForSale: true, price: { amount: "10", currencyCode: "CAD" }, product: { title: "Product", handle: "product" } },
					},
				],
			},
		});

		expect(cart.lines).toHaveLength(1);
		expect(cart.lines[0]?.id).toBe("line-1");
	});

	it("preserves cart-level note, discount codes and line cost", () => {
		const cart = reshapeCart({
			id: "cart-1",
			checkoutUrl: "https://example.com",
			totalQuantity: 2,
			note: "gift wrap please",
			discountCodes: [{ code: "SAVE10", applicable: true }],
			cost: {
				subtotalAmount: { amount: "50", currencyCode: "USD" },
				totalAmount: { amount: "45", currencyCode: "USD" },
			},
			lines: {
				nodes: [
					{
						id: "line-1",
						quantity: 2,
						cost: {
							totalAmount: { amount: "50", currencyCode: "USD" },
							amountPerQuantity: { amount: "25", currencyCode: "USD" },
						},
						merchandise: {
							id: "v1",
							title: "Small",
							availableForSale: true,
							price: { amount: "25", currencyCode: "USD" },
							selectedOptions: [{ name: "Size", value: "Small" }],
							product: { title: "Product", handle: "product" },
						},
					},
				],
			},
		}) as unknown as {
			note: string;
			discountCodes: { code: string }[];
			lines: { cost?: { totalAmount: { amount: string } } }[];
		};

		expect(cart.note).toBe("gift wrap please");
		expect(cart.discountCodes[0]?.code).toBe("SAVE10");
		expect(cart.lines[0]?.cost?.totalAmount.amount).toBe("50");
	});
});
