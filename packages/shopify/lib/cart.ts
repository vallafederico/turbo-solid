import { cacheNone } from "../cache";
import { storefrontFetch } from "../client";
import {
	CART_CREATE,
	CART_DISCOUNT_CODES_UPDATE,
	CART_LINES_ADD,
	CART_LINES_REMOVE,
	CART_LINES_UPDATE,
	CART_NOTE_UPDATE,
} from "../graphql/mutations";
import { GET_CART } from "../graphql/queries";
import type {
	Cart,
	CartLineInput,
	CartLineUpdateInput,
	CartMutationResult,
	RawCart,
	UserError,
} from "../types";
import { reshapeCart } from "../utils/reshape";

function parseCartMutationResult(payload: {
	cart: RawCart | null;
	userErrors: UserError[];
}): CartMutationResult {
	return {
		cart: payload.cart ? (reshapeCart(payload.cart) as Cart) : null,
		userErrors: payload.userErrors ?? [],
	};
}

export async function getCartById(cartId: string): Promise<Cart | null> {
	const { data } = await storefrontFetch<{ cart: RawCart | null }>({
		query: GET_CART,
		variables: { cartId },
		cache: cacheNone,
		operationName: "GetCart",
	});

	if (!data.cart) return null;
	return reshapeCart(data.cart) as Cart;
}

export async function createCart(
	lines: CartLineInput[] = [],
): Promise<CartMutationResult> {
	const { data } = await storefrontFetch<{
		cartCreate: { cart: RawCart | null; userErrors: UserError[] };
	}>({
		query: CART_CREATE,
		variables: { input: { lines } },
		cache: cacheNone,
		operationName: "CartCreate",
	});

	return parseCartMutationResult(data.cartCreate);
}

export async function addCartLines(
	cartId: string,
	lines: CartLineInput[],
): Promise<CartMutationResult> {
	const { data } = await storefrontFetch<{
		cartLinesAdd: { cart: RawCart | null; userErrors: UserError[] };
	}>({
		query: CART_LINES_ADD,
		variables: { cartId, lines },
		cache: cacheNone,
		operationName: "CartLinesAdd",
	});

	return parseCartMutationResult(data.cartLinesAdd);
}

export async function updateCartLines(
	cartId: string,
	lines: CartLineUpdateInput[],
): Promise<CartMutationResult> {
	const { data } = await storefrontFetch<{
		cartLinesUpdate: { cart: RawCart | null; userErrors: UserError[] };
	}>({
		query: CART_LINES_UPDATE,
		variables: { cartId, lines },
		cache: cacheNone,
		operationName: "CartLinesUpdate",
	});

	return parseCartMutationResult(data.cartLinesUpdate);
}

export async function removeCartLines(
	cartId: string,
	lineIds: string[],
): Promise<CartMutationResult> {
	const { data } = await storefrontFetch<{
		cartLinesRemove: { cart: RawCart | null; userErrors: UserError[] };
	}>({
		query: CART_LINES_REMOVE,
		variables: { cartId, lineIds },
		cache: cacheNone,
		operationName: "CartLinesRemove",
	});

	return parseCartMutationResult(data.cartLinesRemove);
}

export async function updateCartQuantity(
	cartId: string,
	lineId: string,
	quantity: number,
): Promise<CartMutationResult> {
	if (quantity <= 0) {
		return removeCartLines(cartId, [lineId]);
	}
	return updateCartLines(cartId, [{ id: lineId, quantity }]);
}

export async function updateCartDiscountCodes(
	cartId: string,
	discountCodes: string[],
): Promise<CartMutationResult> {
	const { data } = await storefrontFetch<{
		cartDiscountCodesUpdate: { cart: RawCart | null; userErrors: UserError[] };
	}>({
		query: CART_DISCOUNT_CODES_UPDATE,
		variables: { cartId, discountCodes },
		cache: cacheNone,
		operationName: "CartDiscountCodesUpdate",
	});

	return parseCartMutationResult(data.cartDiscountCodesUpdate);
}

export async function updateCartNote(
	cartId: string,
	note: string,
): Promise<CartMutationResult> {
	const { data } = await storefrontFetch<{
		cartNoteUpdate: { cart: RawCart | null; userErrors: UserError[] };
	}>({
		query: CART_NOTE_UPDATE,
		variables: { cartId, note },
		cache: cacheNone,
		operationName: "CartNoteUpdate",
	});

	return parseCartMutationResult(data.cartNoteUpdate);
}
