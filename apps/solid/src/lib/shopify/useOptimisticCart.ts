import type { Cart, OptimisticLine, OptimisticMutation } from "@local/shopify";
import { mergeOptimisticCart } from "@local/shopify";
import { useSubmission } from "@solidjs/router";
import { createMemo } from "solid-js";
import {
	addToCart,
	removeFromCart,
	updateCartQuantity,
	type AddToCartInput,
} from "~/lib/shopify/cart";

function toMutation(input: unknown): OptimisticMutation | null {
	if (!input || typeof input !== "object") return null;

	if ("merchandiseId" in input) {
		const add = input as AddToCartInput;
		return {
			type: "add",
			merchandiseId: add.merchandiseId,
			quantity: add.quantity ?? 1,
			variant: add.variant,
		};
	}

	if ("lineId" in input) {
		const line = input as { lineId: string; quantity?: number };
		if (typeof line.quantity === "number") {
			return { type: "update", lineId: line.lineId, quantity: line.quantity };
		}
		return { type: "remove", lineId: line.lineId };
	}

	return null;
}

export function useOptimisticCart(confirmedCart: () => Cart | null | undefined) {
	const addSubmission = useSubmission(addToCart);
	const updateSubmission = useSubmission(updateCartQuantity);
	const removeSubmission = useSubmission(removeFromCart);

	const cart = createMemo((): Cart | null => {
		const base = confirmedCart() ?? null;
		const pendingSubmissions = [
			addSubmission,
			updateSubmission,
			removeSubmission,
		].filter((submission) => submission.pending);

		if (!pendingSubmissions.length) return base;

		// Solid Router submissions expose `.input` as the action's arguments
		// tuple (e.g. `[payload]`), so unwrap the first argument.
		const mutations = pendingSubmissions
			.map((submission) =>
				toMutation((submission.input as unknown[] | undefined)?.[0]),
			)
			.filter((mutation): mutation is OptimisticMutation => mutation !== null);

		return mergeOptimisticCart(base, mutations);
	});

	const isLineOptimistic = (lineId: string) =>
		cart()?.lines.some(
			(line) => line.id === lineId && (line as OptimisticLine).isOptimistic,
		) ?? false;

	const isLinePending = (lineId: string) => {
		if (updateSubmission.pending) {
			const input = (updateSubmission.input as unknown[] | undefined)?.[0] as
				| { lineId?: string }
				| undefined;
			if (input?.lineId === lineId) return true;
		}
		if (removeSubmission.pending) {
			const input = (removeSubmission.input as unknown[] | undefined)?.[0] as
				| { lineId?: string }
				| undefined;
			if (input?.lineId === lineId) return true;
		}
		return false;
	};

	return {
		cart,
		isLineOptimistic,
		isLinePending,
	};
}
