import type { MappedProductOptions, ProductVariant } from "@local/shopify";
import { A, useLocation } from "@solidjs/router";
import { For, Show } from "solid-js";

export type VariantSelectorProps = {
	productOptions: MappedProductOptions[];
	selectedVariant?: ProductVariant;
};

export default function VariantSelector(props: VariantSelectorProps) {
	const location = useLocation();

	const hasChoices = () =>
		props.productOptions.some((option) => option.optionValues.length > 1);

	return (
		<Show when={hasChoices()}>
			<div class="flex flex-col gap-4">
				<For each={props.productOptions}>
					{(option) => (
						<Show when={option.optionValues.length > 1}>
							<div>
								<p class="mb-2 text-sm font-medium">{option.name}</p>
								<div class="flex flex-wrap gap-2">
									<For each={option.optionValues}>
										{(value) => {
											const href = value.isDifferentProduct
												? `/_/shop/${value.handle}?${value.variantUriQuery}`
												: `${location.pathname}?${value.variantUriQuery}`;

											return (
												<A
													href={href}
													replace={!value.isDifferentProduct}
													aria-disabled={!value.exists}
													title={
														value.available ? value.name : `${value.name} (sold out)`
													}
													class="flex items-center gap-2 rounded border px-3 py-1 text-sm transition"
													classList={{
														"border-black bg-black text-white": value.selected,
														"border-neutral-300": !value.selected,
														"opacity-40 line-through": !value.available,
														"pointer-events-none": !value.exists,
													}}
												>
													<Show when={value.swatch?.color}>
														<span
															class="size-4 rounded-full border"
															style={{ "background-color": value.swatch?.color ?? "" }}
														/>
													</Show>
													{value.name}
												</A>
											);
										}}
									</For>
								</div>
							</div>
						</Show>
					)}
				</For>

				<Show
					when={props.selectedVariant && !props.selectedVariant.availableForSale}
				>
					<p class="text-sm text-red-600">Selected variant is sold out.</p>
				</Show>
			</div>
		</Show>
	);
}
