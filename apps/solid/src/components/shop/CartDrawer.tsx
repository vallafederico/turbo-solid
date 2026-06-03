import { lineCompareAtTotal, lineOptionsLabel, lineTotal } from "@local/shopify";
import { Money, ShopifyImage } from "@local/shopify/solid";
import { useAction } from "@solidjs/router";
import { For, Show } from "solid-js";
import { removeFromCart, updateCartQuantity } from "~/lib/shopify/cart";

export type CartDrawerProps = {
	open: boolean;
	onClose: () => void;
	cart: () => import("@local/shopify").Cart | null | undefined;
	isLinePending: (lineId: string) => boolean;
	isLineOptimistic: (lineId: string) => boolean;
};

export default function CartDrawer(props: CartDrawerProps) {
	const updateQty = useAction(updateCartQuantity);
	const removeLine = useAction(removeFromCart);
	const cart = props.cart;

	return (
		<Show when={props.open}>
			<div class="fixed inset-0 z-[200]">
				<button
					type="button"
					class="absolute inset-0 bg-black/40"
					aria-label="Close cart"
					onClick={props.onClose}
				/>
				<aside class="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-white p-6 shadow-xl">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-xl font-semibold">Cart</h2>
						<button type="button" onClick={props.onClose}>
							Close
						</button>
					</div>

					<Show
						when={cart()?.lines.length}
						fallback={<p class="text-sm text-neutral-500">Your cart is empty.</p>}
					>
						<ul class="flex flex-1 flex-col gap-4 overflow-y-auto">
							<For each={cart()?.lines}>
								{(line) => {
									const pending =
										props.isLinePending(line.id) ||
										props.isLineOptimistic(line.id);

									return (
										<li class="flex gap-3 border-b pb-4">
											<ShopifyImage
												image={line.merchandise.image}
												alt={line.merchandise.product.title}
												width={80}
												height={80}
												class="size-20 object-cover"
											/>
											<div class="flex flex-1 flex-col gap-2">
												<div>
													<p class="font-medium">{line.merchandise.product.title}</p>
													<p class="text-sm text-neutral-600">
														{lineOptionsLabel(line)}
													</p>
												</div>
												<Show when={!pending}>
													<div class="flex items-baseline gap-2">
														<Money data={lineTotal(line)} />
														<Show when={lineCompareAtTotal(line)}>
															<Money
																data={lineCompareAtTotal(line)}
																class="text-xs text-neutral-400 line-through"
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
														class="ml-auto text-sm underline disabled:opacity-50"
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
					</Show>

					<div class="mt-auto border-t pt-4">
						<Show when={cart()?.cost.subtotalAmount}>
							<div class="mb-4 flex justify-between">
								<span>Subtotal</span>
								<Money data={cart()!.cost.subtotalAmount} />
							</div>
						</Show>
						<Show when={cart()?.checkoutUrl && cart()!.lines.length > 0}>
							<a
								href={cart()!.checkoutUrl}
								class="block rounded bg-black px-4 py-3 text-center text-white"
							>
								Checkout
							</a>
						</Show>
					</div>
				</aside>
			</div>
		</Show>
	);
}
