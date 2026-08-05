import {
	addCartLines,
	createCart,
	getCartById,
	removeCartLines,
	updateCartDiscountCodes,
	updateCartQuantity as updateCartLineQuantity,
	type Cart,
	type CartMutationResult,
	type Money,
	type ShopifyImage,
} from "@local/shopify";
import { action, query, revalidate } from "@solidjs/router";
import { deleteCookie, getCookie, setCookie } from "@solidjs/start/http";

export const CART_COOKIE = "cart";
const CART_MAX_AGE = 60 * 60 * 24 * 365;

export type OptimisticVariantPayload = {
	id: string;
	title: string;
	price: Money;
	image?: ShopifyImage | null;
	product: { title: string; handle: string };
};

export type AddToCartInput = {
	merchandiseId: string;
	quantity?: number;
	variant?: OptimisticVariantPayload;
};

export type UpdateCartQuantityInput = {
	lineId: string;
	quantity: number;
};

export type RemoveFromCartInput = {
	lineId: string;
};

export type DiscountCodeInput = {
	code: string;
};

function setCartCookie(cartId: string) {
	setCookie(CART_COOKIE, cartId, {
		httpOnly: true,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: CART_MAX_AGE,
	});
}

function clearCartCookie() {
	deleteCookie(CART_COOKIE, { path: "/" });
}

async function recoverCartMutation(
	cartId: string,
	fallback: () => Promise<CartMutationResult>,
): Promise<CartMutationResult> {
	const result = await fallback();
	if (!result.cart) {
		clearCartCookie();
	}
	return result;
}

export const getCart = query(async (): Promise<Cart | null> => {
	"use server";

	const cartId = getCookie(CART_COOKIE);
	if (!cartId) return null;

	try {
		const cart = await getCartById(cartId);
		if (!cart) {
			clearCartCookie();
			return null;
		}
		return cart;
	} catch {
		clearCartCookie();
		return null;
	}
}, "cart");

export const addToCart = action(
	async (input: AddToCartInput): Promise<CartMutationResult> => {
		"use server";

		const quantity = Math.max(1, input.quantity ?? 1);
		const line = { merchandiseId: input.merchandiseId, quantity };
		const cartId = getCookie(CART_COOKIE);
		let result: CartMutationResult;

		if (!cartId) {
			result = await createCart([line]);
		} else {
			result = await addCartLines(cartId, [line]);
			if (!result.cart) {
				clearCartCookie();
				result = await createCart([line]);
			}
		}

		if (result.cart) {
			setCartCookie(result.cart.id);
		}

		revalidate(getCart.key);
		return result;
	},
	"addToCart",
);

export const updateCartQuantity = action(
	async (input: UpdateCartQuantityInput): Promise<CartMutationResult> => {
		"use server";

		const cartId = getCookie(CART_COOKIE);
		if (!cartId) {
			return { cart: null, userErrors: [{ message: "Cart not found" }] };
		}

		const quantity = Math.max(0, input.quantity);
		const result = await recoverCartMutation(cartId, () =>
			updateCartLineQuantity(cartId, input.lineId, quantity),
		);

		if (result.cart) {
			setCartCookie(result.cart.id);
		}

		revalidate(getCart.key);
		return result;
	},
	"updateCartQuantity",
);

export const removeFromCart = action(
	async (input: RemoveFromCartInput): Promise<CartMutationResult> => {
		"use server";

		const cartId = getCookie(CART_COOKIE);
		if (!cartId) {
			return { cart: null, userErrors: [{ message: "Cart not found" }] };
		}

		const result = await recoverCartMutation(cartId, () =>
			removeCartLines(cartId, [input.lineId]),
		);

		if (result.cart) {
			setCartCookie(result.cart.id);
		}

		revalidate(getCart.key);
		return result;
	},
	"removeFromCart",
);

export const applyDiscountCode = action(
	async (input: DiscountCodeInput): Promise<CartMutationResult> => {
		"use server";

		const cartId = getCookie(CART_COOKIE);
		if (!cartId) {
			return { cart: null, userErrors: [{ message: "Cart not found" }] };
		}

		const code = input.code.trim();
		const result = await recoverCartMutation(cartId, () =>
			updateCartDiscountCodes(cartId, code ? [code] : []),
		);

		if (result.cart) {
			setCartCookie(result.cart.id);
		}

		revalidate(getCart.key);
		return result;
	},
	"applyDiscountCode",
);
