import type {
	Product,
	ProductOption,
	ProductOptionValue,
	ProductVariant,
	SelectedOption,
	SelectedOptionInput,
} from "../types";

/**
 * Variant option utilities ported from `@shopify/hydrogen-react`
 * (`optionValueDecoder` + `getProductOptions`). Kept framework-agnostic so the
 * package can be consumed from Solid (and later Next) without pulling React.
 *
 * The encoded option strategy lets the Storefront API express which variant
 * combinations exist/are purchasable without sending every variant, which is
 * why we no longer fetch `variants(first: 100)`.
 */

const OPTION_VALUE_SEPARATOR = ",";

const V1_CONTROL_CHARS = {
	OPTION: ":",
	END_OF_PREFIX: ",",
	SEQUENCE_GAP: " ",
	RANGE: "-",
} as const;

export function decodeEncodedVariant(
	encodedVariantField?: string | null,
): number[][] {
	if (!encodedVariantField) return [];
	if (encodedVariantField.startsWith("v1_")) {
		return v1Decoder(encodedVariantField.replace(/^v1_/, ""));
	}
	throw new Error("Unsupported option value encoding");
}

function v1Decoder(encodedVariantField: string): number[][] {
	const tokenizer = /[ :,-]/g;
	let index = 0;
	let token: RegExpExecArray | null;
	const options: number[][] = [];
	const currentOptionValue: number[] = [];
	let depth = 0;
	let rangeStart: number | null = null;

	while ((token = tokenizer.exec(encodedVariantField))) {
		const operation = token[0];
		const optionValueIndex =
			Number.parseInt(encodedVariantField.slice(index, token.index)) || 0;

		if (rangeStart !== null) {
			for (; rangeStart < optionValueIndex; rangeStart++) {
				currentOptionValue[depth] = rangeStart;
				options.push([...currentOptionValue]);
			}
			rangeStart = null;
		}

		currentOptionValue[depth] = optionValueIndex;

		if (operation === V1_CONTROL_CHARS.RANGE) {
			rangeStart = optionValueIndex;
		} else if (operation === V1_CONTROL_CHARS.OPTION) {
			depth++;
		} else {
			if (
				operation === V1_CONTROL_CHARS.SEQUENCE_GAP ||
				(operation === V1_CONTROL_CHARS.END_OF_PREFIX &&
					encodedVariantField[token.index - 1] !==
						V1_CONTROL_CHARS.END_OF_PREFIX)
			) {
				options.push([...currentOptionValue]);
			}
			if (operation === V1_CONTROL_CHARS.END_OF_PREFIX) {
				currentOptionValue.pop();
				depth--;
			}
		}
		index = tokenizer.lastIndex;
	}

	const encodingEndsWithIndex = encodedVariantField.match(/\d+$/g);
	if (encodingEndsWithIndex) {
		const finalValueIndex = Number.parseInt(encodingEndsWithIndex[0]);
		if (rangeStart != null) {
			for (; rangeStart <= finalValueIndex; rangeStart++) {
				currentOptionValue[depth] = rangeStart;
				options.push([...currentOptionValue]);
			}
		} else {
			options.push([finalValueIndex]);
		}
	}

	return options;
}

const decodedOptionValues = new Map<string, Set<string>>();

export function isOptionValueCombinationInEncodedVariant(
	targetOptionValueCombination: number[],
	encodedVariantField: string,
): boolean {
	if (targetOptionValueCombination.length === 0) return false;

	if (!decodedOptionValues.has(encodedVariantField)) {
		const set = new Set<string>();
		for (const optionValue of decodeEncodedVariant(encodedVariantField)) {
			set.add(optionValue.join(OPTION_VALUE_SEPARATOR));
			for (let i = 0; i < optionValue.length; i++) {
				set.add(optionValue.slice(0, i + 1).join(OPTION_VALUE_SEPARATOR));
			}
		}
		decodedOptionValues.set(encodedVariantField, set);
	}

	return Boolean(
		decodedOptionValues
			.get(encodedVariantField)
			?.has(targetOptionValueCombination.join(OPTION_VALUE_SEPARATOR)),
	);
}

type ProductOptionsMapping = Record<string, Record<string, number>>;

function mapProductOptions(options: ProductOption[]): ProductOptionsMapping {
	return Object.assign(
		{},
		...options.map((option) => ({
			[option.name]: Object.assign(
				{},
				...(option.optionValues ?? []).map((value, index) => ({
					[value.name]: index,
				})),
			),
		})),
	);
}

export function mapSelectedProductOptionToObject(
	options: Pick<SelectedOption, "name" | "value">[],
): Record<string, string> {
	return Object.assign(
		{},
		...options.map((key) => ({ [key.name]: key.value })),
	);
}

function encodeSelectedProductOptionAsKey(
	selectedOption: Pick<SelectedOption, "name" | "value">[] | Record<string, string>,
): string {
	if (Array.isArray(selectedOption)) {
		return JSON.stringify(
			Object.assign(
				{},
				...selectedOption.map((option) => ({ [option.name]: option.value })),
			),
		);
	}
	return JSON.stringify(selectedOption);
}

function buildEncodingArrayFromSelectedOptions(
	selectedOption: Record<string, string>,
	productOptionMappings: ProductOptionsMapping,
): number[] {
	return Object.keys(selectedOption)
		.map((key) =>
			productOptionMappings[key]
				? productOptionMappings[key][selectedOption[key]]
				: null,
		)
		.filter((code): code is number => code !== null && code !== undefined);
}

function mapVariants(
	variants: ProductVariant[],
): Record<string, ProductVariant> {
	return Object.assign(
		{},
		...variants.map((variant) => ({
			[encodeSelectedProductOptionAsKey(variant.selectedOptions ?? [])]:
				variant,
		})),
	);
}

export type MappedProductOptionValue = ProductOptionValue & {
	variant?: ProductVariant;
	handle: string;
	variantUriQuery: string;
	selected: boolean;
	exists: boolean;
	available: boolean;
	isDifferentProduct: boolean;
};

export type MappedProductOptions = {
	name: string;
	optionValues: MappedProductOptionValue[];
};

/**
 * Collect every variant exposed by `selectedOrFirstAvailableVariant`,
 * `adjacentVariants` and each option value's `firstSelectableVariant`.
 */
export function getAdjacentAndFirstAvailableVariants(
	product: Pick<
		Product,
		"options" | "selectedOrFirstAvailableVariant" | "adjacentVariants"
	>,
): ProductVariant[] {
	const availableVariants: Record<string, ProductVariant> = {};

	for (const option of product.options ?? []) {
		for (const value of option.optionValues ?? []) {
			if (value.firstSelectableVariant) {
				const key = mapSelectedProductOptionToObjectAsString(
					value.firstSelectableVariant.selectedOptions,
				);
				availableVariants[key] = value.firstSelectableVariant;
			}
		}
	}

	for (const variant of product.adjacentVariants ?? []) {
		const key = mapSelectedProductOptionToObjectAsString(
			variant.selectedOptions,
		);
		availableVariants[key] = variant;
	}

	const selectedVariant = product.selectedOrFirstAvailableVariant;
	if (selectedVariant) {
		const key = mapSelectedProductOptionToObjectAsString(
			selectedVariant.selectedOptions,
		);
		availableVariants[key] = selectedVariant;
	}

	return Object.values(availableVariants);
}

function mapSelectedProductOptionToObjectAsString(
	options: Pick<SelectedOption, "name" | "value">[],
): string {
	return JSON.stringify(mapSelectedProductOptionToObject(options));
}

/**
 * Build the product options grid with per-option-value variant, URL query,
 * and existence/availability flags derived from the encoded variant strings.
 */
export function getProductOptions(
	product: Pick<
		Product,
		| "handle"
		| "options"
		| "selectedOrFirstAvailableVariant"
		| "adjacentVariants"
		| "encodedVariantExistence"
		| "encodedVariantAvailability"
	>,
): MappedProductOptions[] {
	const options = product.options ?? [];
	if (!options.length) return [];

	const selectedVariant = product.selectedOrFirstAvailableVariant ?? undefined;
	const adjacentVariants = product.adjacentVariants ?? [];
	const productHandle = product.handle;
	const encodedVariantExistence = product.encodedVariantExistence ?? "";
	const encodedVariantAvailability = product.encodedVariantAvailability ?? "";

	const selectedOptionKeys = selectedVariant?.selectedOptions.map(
		(option) => option.name,
	);
	const filteredOptions = options.filter(
		(option) =>
			!selectedOptionKeys || selectedOptionKeys.indexOf(option.name) >= 0,
	);

	const productOptionMappings = mapProductOptions(options);
	const variants = mapVariants(
		selectedVariant ? [selectedVariant, ...adjacentVariants] : adjacentVariants,
	);
	const selectedOptions = mapSelectedProductOptionToObject(
		selectedVariant ? selectedVariant.selectedOptions : [],
	);

	return filteredOptions.map((option, optionIndex) => ({
		name: option.name,
		optionValues: option.optionValues.map((value) => {
			const targetOptionParams = { ...selectedOptions };
			targetOptionParams[option.name] = value.name;

			const targetKey = encodeSelectedProductOptionAsKey(targetOptionParams);
			const encodingKey = buildEncodingArrayFromSelectedOptions(
				targetOptionParams,
				productOptionMappings,
			);

			const topDownKey = encodingKey.slice(0, optionIndex + 1);
			const exists = isOptionValueCombinationInEncodedVariant(
				topDownKey,
				encodedVariantExistence,
			);
			const available = isOptionValueCombinationInEncodedVariant(
				topDownKey,
				encodedVariantAvailability,
			);

			const variant = variants[targetKey] ?? value.firstSelectableVariant;

			const variantOptionParam = variant
				? mapSelectedProductOptionToObject(variant.selectedOptions ?? [])
				: {};
			const searchParams = new URLSearchParams(variantOptionParam);
			const handle = variant?.product?.handle ?? productHandle;

			return {
				...value,
				variant: variant ?? undefined,
				handle,
				variantUriQuery: searchParams.toString(),
				selected: selectedOptions[option.name] === value.name,
				exists,
				available,
				isDifferentProduct: handle !== productHandle,
			};
		}),
	}));
}

/**
 * Convert URL search params into the `[{ name, value }]` shape the Storefront
 * API expects for `selectedOrFirstAvailableVariant(selectedOptions:)`.
 */
export function getSelectedProductOptions(
	search: URLSearchParams | Record<string, string>,
): SelectedOptionInput[] {
	const params =
		search instanceof URLSearchParams ? search : new URLSearchParams(search);
	const selected: SelectedOptionInput[] = [];
	for (const [name, value] of params.entries()) {
		selected.push({ name, value });
	}
	return selected;
}
