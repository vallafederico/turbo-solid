import { describe, expect, it } from "vitest";
import type { Product } from "../types";
import {
	decodeEncodedVariant,
	getProductOptions,
	getSelectedProductOptions,
	isOptionValueCombinationInEncodedVariant,
} from "./productOptions";

describe("decodeEncodedVariant", () => {
	// Vector from Hydrogen's optionValueDecoder docs.
	const encoded = "v1_0:0:0,1:0-1,,1:0:0-1,1:1,,2:0:1,1:0,,";
	const expected = [
		[0, 0, 0],
		[0, 1, 0],
		[0, 1, 1],
		[1, 0, 0],
		[1, 0, 1],
		[1, 1, 1],
		[2, 0, 1],
		[2, 1, 0],
	];

	it("decodes the trie back to the original combinations", () => {
		expect(decodeEncodedVariant(encoded)).toEqual(expected);
	});

	it("returns [] for empty input", () => {
		expect(decodeEncodedVariant("")).toEqual([]);
		expect(decodeEncodedVariant(null)).toEqual([]);
	});

	it("matches full and partial combinations", () => {
		expect(isOptionValueCombinationInEncodedVariant([0, 1, 1], encoded)).toBe(
			true,
		);
		expect(isOptionValueCombinationInEncodedVariant([2], encoded)).toBe(true);
		expect(isOptionValueCombinationInEncodedVariant([2, 1], encoded)).toBe(true);
		expect(isOptionValueCombinationInEncodedVariant([0, 0, 1], encoded)).toBe(
			false,
		);
	});
});

describe("getProductOptions", () => {
	const product: Pick<
		Product,
		| "handle"
		| "options"
		| "selectedOrFirstAvailableVariant"
		| "adjacentVariants"
		| "encodedVariantExistence"
		| "encodedVariantAvailability"
	> = {
		handle: "slides",
		encodedVariantExistence: "v1_0-2",
		encodedVariantAvailability: "v1_0 2",
		options: [
			{
				name: "Size",
				optionValues: [
					{
						name: "Small",
						firstSelectableVariant: {
							id: "v-small",
							title: "Small",
							availableForSale: true,
							price: { amount: "25.0", currencyCode: "USD" },
							selectedOptions: [{ name: "Size", value: "Small" }],
							product: { handle: "slides", title: "Slides" },
						},
					},
					{
						name: "Medium",
						firstSelectableVariant: {
							id: "v-medium",
							title: "Medium",
							availableForSale: false,
							price: { amount: "25.0", currencyCode: "USD" },
							selectedOptions: [{ name: "Size", value: "Medium" }],
							product: { handle: "slides", title: "Slides" },
						},
					},
					{
						name: "Large",
						firstSelectableVariant: {
							id: "v-large",
							title: "Large",
							availableForSale: true,
							price: { amount: "25.0", currencyCode: "USD" },
							selectedOptions: [{ name: "Size", value: "Large" }],
							product: { handle: "slides", title: "Slides" },
						},
					},
				],
			},
		],
		adjacentVariants: [],
		selectedOrFirstAvailableVariant: {
			id: "v-small",
			title: "Small",
			availableForSale: true,
			price: { amount: "25.0", currencyCode: "USD" },
			selectedOptions: [{ name: "Size", value: "Small" }],
			product: { handle: "slides", title: "Slides" },
		},
	};

	it("maps option values with variant, query, existence and availability", () => {
		const [size] = getProductOptions(product);
		expect(size.name).toBe("Size");

		const small = size.optionValues[0];
		expect(small.selected).toBe(true);
		expect(small.exists).toBe(true);
		expect(small.available).toBe(true);
		expect(small.variantUriQuery).toBe("Size=Small");
		expect(small.isDifferentProduct).toBe(false);

		const medium = size.optionValues[1];
		expect(medium.exists).toBe(true);
		expect(medium.available).toBe(false);
	});
});

describe("getProductOptions (multi-option)", () => {
	// Color (Red=0, Blue=1) x Size (Small=0, Medium=1), all 4 combos present.
	const encoded = "v1_0:0 1,1:0 1,";

	const v = (color: string, size: string, available = true): ProductVariant => ({
		id: `${color}-${size}`,
		title: `${color} / ${size}`,
		availableForSale: available,
		price: { amount: "25.0", currencyCode: "USD" },
		selectedOptions: [
			{ name: "Color", value: color },
			{ name: "Size", value: size },
		],
		product: { handle: "tee", title: "Tee" },
	});

	const product: Pick<
		Product,
		| "handle"
		| "options"
		| "selectedOrFirstAvailableVariant"
		| "adjacentVariants"
		| "encodedVariantExistence"
		| "encodedVariantAvailability"
	> = {
		handle: "tee",
		encodedVariantExistence: encoded,
		encodedVariantAvailability: encoded,
		options: [
			{
				name: "Color",
				optionValues: [
					{ name: "Red", firstSelectableVariant: v("Red", "Small") },
					{ name: "Blue", firstSelectableVariant: v("Blue", "Small") },
				],
			},
			{
				name: "Size",
				optionValues: [
					{ name: "Small", firstSelectableVariant: v("Red", "Small") },
					{ name: "Medium", firstSelectableVariant: v("Red", "Medium") },
				],
			},
		],
		adjacentVariants: [v("Red", "Medium"), v("Blue", "Small"), v("Blue", "Medium")],
		selectedOrFirstAvailableVariant: v("Red", "Small"),
	};

	it("decodes the 2x2 existence string correctly (self-check)", () => {
		expect(decodeEncodedVariant(encoded)).toEqual([
			[0, 0],
			[0, 1],
			[1, 0],
			[1, 1],
		]);
	});

	it("builds cross-option query params and per-option selection", () => {
		const [color, size] = getProductOptions(product);

		const blue = color.optionValues.find((o) => o.name === "Blue");
		// Keeps current Size=Small, switches Color to Blue.
		expect(new URLSearchParams(blue?.variantUriQuery).get("Color")).toBe("Blue");
		expect(new URLSearchParams(blue?.variantUriQuery).get("Size")).toBe("Small");
		expect(blue?.selected).toBe(false);
		expect(blue?.exists).toBe(true);
		expect(blue?.available).toBe(true);
		expect(blue?.isDifferentProduct).toBe(false);

		const red = color.optionValues.find((o) => o.name === "Red");
		expect(red?.selected).toBe(true);

		const medium = size.optionValues.find((o) => o.name === "Medium");
		expect(new URLSearchParams(medium?.variantUriQuery).get("Size")).toBe(
			"Medium",
		);
		expect(medium?.selected).toBe(false);
	});
});

describe("getSelectedProductOptions", () => {
	it("parses URL params into selected option inputs", () => {
		expect(getSelectedProductOptions({ Size: "Small", Color: "Green" })).toEqual(
			[
				{ name: "Size", value: "Small" },
				{ name: "Color", value: "Green" },
			],
		);
	});
});
