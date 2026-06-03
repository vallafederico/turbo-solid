import { describe, expect, it } from "vitest";
import type { Cart } from "../types";
import {
	mergeOptimisticCart,
	type OptimisticVariant,
} from "./optimistic";

const variant: OptimisticVariant = {
	id: "v1",
	title: "Small",
	price: { amount: "25.0", currencyCode: "USD" },
	product: { title: "Slides", handle: "slides" },
	selectedOptions: [{ name: "Size", value: "Small" }],
};

function baseCart(): Cart {
	return {
		id: "cart-1",
		checkoutUrl: "https://checkout",
		totalQuantity: 1,
		cost: {
			subtotalAmount: { amount: "25.0", currencyCode: "USD" },
			totalAmount: { amount: "25.0", currencyCode: "USD" },
		},
		lines: [
			{
				id: "line-1",
				quantity: 1,
				cost: {
					totalAmount: { amount: "25.0", currencyCode: "USD" },
					amountPerQuantity: { amount: "25.0", currencyCode: "USD" },
				},
				merchandise: {
					id: "v1",
					title: "Small",
					availableForSale: true,
					price: { amount: "25.0", currencyCode: "USD" },
					product: { title: "Slides", handle: "slides" },
				},
			},
		],
	};
}

describe("mergeOptimisticCart", () => {
	it("returns base lines when there are no mutations", () => {
		const base = baseCart();
		const result = mergeOptimisticCart(base, []);
		expect(result.lines).toHaveLength(1);
		expect(result.totalQuantity).toBe(1);
	});

	it("adds a brand new optimistic line", () => {
		const result = mergeOptimisticCart(null, [
			{ type: "add", merchandiseId: "v9", quantity: 2, variant: { ...variant, id: "v9" } },
		]);
		expect(result.lines).toHaveLength(1);
		expect(result.lines[0].isOptimistic).toBe(true);
		expect(result.lines[0].quantity).toBe(2);
		expect(result.lines[0].cost?.totalAmount.amount).toBe("50");
		expect(result.totalQuantity).toBe(2);
	});

	it("increments an existing line instead of duplicating", () => {
		const result = mergeOptimisticCart(baseCart(), [
			{ type: "add", merchandiseId: "v1", quantity: 3, variant },
		]);
		expect(result.lines).toHaveLength(1);
		expect(result.lines[0].quantity).toBe(4);
		expect(result.totalQuantity).toBe(4);
	});

	it("updates quantity and recomputes line total", () => {
		const result = mergeOptimisticCart(baseCart(), [
			{ type: "update", lineId: "line-1", quantity: 3 },
		]);
		expect(result.lines[0].quantity).toBe(3);
		expect(result.lines[0].cost?.totalAmount.amount).toBe("75");
		expect(result.totalQuantity).toBe(3);
	});

	it("removes the line when updated to zero", () => {
		const result = mergeOptimisticCart(baseCart(), [
			{ type: "update", lineId: "line-1", quantity: 0 },
		]);
		expect(result.lines).toHaveLength(0);
		expect(result.totalQuantity).toBe(0);
	});

	it("removes a line and never goes negative", () => {
		const result = mergeOptimisticCart(baseCart(), [
			{ type: "remove", lineId: "line-1" },
			{ type: "remove", lineId: "line-1" },
		]);
		expect(result.lines).toHaveLength(0);
		expect(result.totalQuantity).toBe(0);
	});

	it("does not mutate the confirmed cart's line objects", () => {
		const base = baseCart();
		const before = base.lines[0].quantity;
		mergeOptimisticCart(base, [
			{ type: "add", merchandiseId: "v1", quantity: 5, variant },
		]);
		expect(base.lines[0].quantity).toBe(before);
		expect(base.totalQuantity).toBe(1);
	});
});
