import type { CartLine, Money } from "../types";

/** Line total (price × quantity), falling back to unit price if cost is absent. */
export function lineTotal(line: CartLine): Money {
	return line.cost?.totalAmount ?? line.merchandise.price;
}

/**
 * Compare-at total for a line (per-unit compare-at × quantity), or undefined
 * when there is no genuine markdown to show.
 */
export function lineCompareAtTotal(line: CartLine): Money | undefined {
	const compareAt = line.cost?.compareAtAmountPerQuantity;
	const unit = line.cost?.amountPerQuantity ?? line.merchandise.price;
	if (!compareAt) return undefined;
	if (Number(compareAt.amount) <= Number(unit.amount)) return undefined;
	return {
		amount: String(Number(compareAt.amount) * line.quantity),
		currencyCode: compareAt.currencyCode,
	};
}

/** Human label for a cart line, preferring selected options over variant title. */
export function lineOptionsLabel(line: CartLine): string {
	const options = line.merchandise.selectedOptions;
	if (options?.length) {
		return options.map((option) => option.value).join(" / ");
	}
	return line.merchandise.title;
}
