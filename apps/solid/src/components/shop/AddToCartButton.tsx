import { useAction, useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import { formatUserErrors } from "@local/shopify";
import {
	addToCart,
	type AddToCartInput,
	type OptimisticVariantPayload,
} from "~/lib/shopify/cart";

export type AddToCartButtonProps = {
	merchandiseId: string;
	variant?: OptimisticVariantPayload;
	disabled?: boolean;
	quantity?: number;
	class?: string;
};

export default function AddToCartButton(props: AddToCartButtonProps) {
	const submit = useAction(addToCart);
	const submission = useSubmission(addToCart);

	const handleClick = () => {
		if (props.disabled || !props.merchandiseId) return;

		const input: AddToCartInput = {
			merchandiseId: props.merchandiseId,
			quantity: props.quantity ?? 1,
			variant: props.variant,
		};

		submit(input);
	};

	return (
		<div class="flex flex-col gap-2">
			<button
				type="button"
				class={props.class ?? "rounded bg-black px-4 py-2 text-white disabled:opacity-50"}
				disabled={props.disabled || submission.pending}
				onClick={handleClick}
			>
				{submission.pending ? "Adding…" : "Add to cart"}
			</button>
			<Show when={submission.result?.userErrors?.length}>
				<p class="text-sm text-red-600">
					{formatUserErrors(submission.result?.userErrors)}
				</p>
			</Show>
		</div>
	);
}
