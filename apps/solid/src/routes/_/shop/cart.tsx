import {
	formatUserErrors,
	lineCompareAtTotal,
	lineOptionsLabel,
	lineTotal,
} from "@local/shopify";
import { Money, ShopifyImage } from "@local/shopify/solid";
import { Title } from "@solidjs/meta";
import { useAction, useSubmission } from "@solidjs/router";
import { createAsync } from "@solidjs/router";
import { For, Show } from "solid-js";
import {
	applyDiscountCode,
	getCart,
	removeFromCart,
	updateCartQuantity,
} from "~/lib/shopify/cart";
import { useOptimisticCart } from "~/lib/shopify/useOptimisticCart";

export const route = {
	preload: () => getCart(),
};

export default function CartPage() {
	const confirmedCart = createAsync(() => getCart(), { deferStream: true });
	const optimistic = useOptimisticCart(confirmedCart);
	const cart = () => optimistic.cart();
	const updateQty = useAction(updateCartQuantity);
	const removeLine = useAction(removeFromCart);
	const applyDiscount = useAction(applyDiscountCode);
	const discountSubmission = useSubmission(applyDiscountCode);

	let discountInput: HTMLInputElement | undefined;

	return (
		<div class="min-h-[100vh] pt-24 pb-16">
			<Title>Cart | Mock Shop</Title>
			<div class="px-gx mx-auto max-w-3xl">
				<h1 class="mb-8 text-3xl font-semibold">Cart</h1>

				<Show
					when={cart()?.lines.length}
					fallback={<p class="text-neutral-600">Your cart is empty.</p>}
				>
					<ul class="mb-8 flex flex-col gap-6">
						<For each={cart()?.lines}>
							{(line) => {
								const pending =
									optimistic.isLinePending(line.id) ||
									optimistic.isLineOptimistic(line.id);

								return (
									<li class="flex gap-4 border-b pb-6">
										<ShopifyImage
											image={line.merchandise.image}
											alt={line.merchandise.product.title}
											width={120}
											height={120}
											class="size-28 object-cover"
										/>
										<div class="flex flex-1 flex-col gap-3">
											<div>
												<p class="font-medium">{line.merchandise.product.title}</p>
												<p class="text-sm text-neutral-600">
													{line.merchandise.title}
												</p>
											</div>
											<Show when={line.merchandise.selectedOptions?.length}>
												<p class="text-sm text-neutral-500">
													{lineOptionsLabel(line)}
												</p>
											</Show>
											<Show when={!pending}>
												<div class="flex items-baseline gap-2">
													<Money data={lineTotal(line)} />
													<Show when={lineCompareAtTotal(line)}>
														<Money
															data={lineCompareAtTotal(line)}
															class="text-sm text-neutral-400 line-through"
														/>
													</Show>
												</div>
											</Show>
											<div class="flex items-center gap-2">
												<button
													type="button"
													class="rounded border px-2 py-1 disabled:opacity-50"
													disabled={pending}
													onClick={() =>
														updateQty({
															lineId: line.id,
															quantity: line.quantity - 1,
														})
													}
												>
													−
												</button>
												<span>{line.quantity}</span>
												<button
													type="button"
													class="rounded border px-2 py-1 disabled:opacity-50"
													disabled={pending}
													onClick={() =>
														updateQty({
															lineId: line.id,
															quantity: line.quantity + 1,
														})
													}
												>
													+
												</button>
												<button
													type="button"
													class="ml-auto underline disabled:opacity-50"
													disabled={pending}
													onClick={() => removeLine({ lineId: line.id })}
												>
													Remove
												</button>
											</div>
										</div>
									</li>
								);
							}}
						</For>
					</ul>

					<div class="border-t pt-6">
						<form
							class="flex gap-2"
							onSubmit={(event) => {
								event.preventDefault();
								if (discountInput) applyDiscount({ code: discountInput.value });
							}}
						>
							<input
								ref={discountInput}
								type="text"
								placeholder="Discount code"
								class="flex-1 rounded border px-3 py-2"
							/>
							<button
								type="submit"
								class="rounded border px-4 py-2 disabled:opacity-50"
								disabled={discountSubmission.pending}
							>
								{discountSubmission.pending ? "Applying…" : "Apply"}
							</button>
						</form>
						<Show when={discountSubmission.result?.userErrors?.length}>
							<p class="mt-2 text-sm text-red-600">
								{formatUserErrors(discountSubmission.result?.userErrors)}
							</p>
						</Show>
						<Show when={cart()?.discountCodes?.length}>
							<div class="mt-3 flex flex-wrap gap-2">
								<For each={cart()?.discountCodes}>
									{(discount) => (
										<span
											class="rounded-full px-3 py-1 text-sm"
											classList={{
												"bg-green-100 text-green-800": discount.applicable,
												"bg-neutral-100 text-neutral-500 line-through":
													!discount.applicable,
											}}
										>
											{discount.code}
										</span>
									)}
								</For>
								<button
									type="button"
									class="text-sm underline"
									onClick={() => applyDiscount({ code: "" })}
								>
									Clear
								</button>
							</div>
						</Show>
					</div>

					<div class="flex items-center justify-between border-t pt-6">
						<span class="text-lg">Subtotal</span>
						<Money data={cart()!.cost.subtotalAmount} class="text-lg" />
					</div>

					<a
						href={cart()!.checkoutUrl}
						class="mt-6 block rounded bg-black px-4 py-3 text-center text-white"
					>
						Checkout
					</a>
				</Show>
			</div>
		</div>
	);
}
