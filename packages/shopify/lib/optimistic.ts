import type { Cart, CartLine, Money, SelectedOption, ShopifyImage } from "../types";

export type OptimisticVariant = {
	id: string;
	title: string;
	price: Money;
	image?: ShopifyImage | null;
	product: { title: string; handle: string };
	selectedOptions?: SelectedOption[];
	compareAtPrice?: Money | null;
};

export type OptimisticMutation =
	| {
			type: "add";
			merchandiseId: string;
			quantity: number;
			variant?: OptimisticVariant;
	  }
	| { type: "update"; lineId: string; quantity: number }
	| { type: "remove"; lineId: string };

export type OptimisticLine = CartLine & { isOptimistic?: boolean };

export type OptimisticCart = Omit<Cart, "lines"> & { lines: OptimisticLine[] };

function buildOptimisticLine(
	variant: OptimisticVariant,
	quantity: number,
): OptimisticLine {
	const total = String(Number(variant.price.amount) * quantity);
	return {
		id: `optimistic-${variant.id}`,
		quantity,
		isOptimistic: true,
		cost: {
			totalAmount: { amount: total, currencyCode: variant.price.currencyCode },
			amountPerQuantity: variant.price,
			compareAtAmountPerQuantity: variant.compareAtPrice ?? null,
		},
		merchandise: {
			id: variant.id,
			title: variant.title,
			availableForSale: true,
			price: variant.price,
			compareAtPrice: variant.compareAtPrice ?? null,
			selectedOptions: variant.selectedOptions,
			image: variant.image,
			product: variant.product,
		},
	};
}

function withQuantity(line: OptimisticLine, quantity: number): OptimisticLine {
	const unit = line.cost?.amountPerQuantity ?? line.merchandise.price;
	return {
		...line,
		quantity,
		cost: line.cost
			? {
					...line.cost,
					totalAmount: {
						amount: String(Number(unit.amount) * quantity),
						currencyCode: unit.currencyCode,
					},
				}
			: undefined,
	};
}

/**
 * Apply in-flight cart mutations on top of the confirmed cart to produce an
 * optimistic view. Pure and immutable — never mutates the input cart or its
 * line objects (the confirmed cart is shared across renders).
 */
export function mergeOptimisticCart(
	base: Cart | null | undefined,
	mutations: OptimisticMutation[],
): OptimisticCart {
	let lines: OptimisticLine[] = (base?.lines ?? []).map((line) => ({
		...line,
	}));
	let totalQuantity = base?.totalQuantity ?? 0;

	for (const mutation of mutations) {
		if (mutation.type === "add") {
			const quantity = mutation.quantity;
			const index = lines.findIndex(
				(line) => line.merchandise.id === mutation.merchandiseId,
			);
			if (index >= 0) {
				lines[index] = withQuantity(
					lines[index],
					lines[index].quantity + quantity,
				);
			} else if (mutation.variant) {
				lines = [...lines, buildOptimisticLine(mutation.variant, quantity)];
			}
			totalQuantity += quantity;
			continue;
		}

		if (mutation.type === "update") {
			const index = lines.findIndex((line) => line.id === mutation.lineId);
			if (index < 0) continue;
			const delta = mutation.quantity - lines[index].quantity;
			if (mutation.quantity <= 0) {
				lines = lines.filter((line) => line.id !== mutation.lineId);
			} else {
				lines[index] = withQuantity(lines[index], mutation.quantity);
			}
			totalQuantity += delta;
			continue;
		}

		const index = lines.findIndex((line) => line.id === mutation.lineId);
		if (index >= 0) {
			totalQuantity -= lines[index].quantity;
			lines = lines.filter((line) => line.id !== mutation.lineId);
		}
	}

	return {
		id: base?.id ?? "optimistic-cart",
		checkoutUrl: base?.checkoutUrl ?? "#",
		totalQuantity: Math.max(0, totalQuantity),
		note: base?.note ?? null,
		discountCodes: base?.discountCodes ?? [],
		cost: base?.cost ?? {
			subtotalAmount: { amount: "0", currencyCode: "USD" },
			totalAmount: { amount: "0", currencyCode: "USD" },
		},
		lines,
	};
}
