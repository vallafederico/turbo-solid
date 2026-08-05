import { createSignal } from "solid-js";
import { isServer } from "solid-js/web";
import { createAsync } from "@solidjs/router";
import { Link } from "@solidjs/meta";
import CartDrawer from "~/components/shop/CartDrawer";
import { getCart } from "~/lib/shopify/cart";
import { useOptimisticCart } from "~/lib/shopify/useOptimisticCart";
import type { RouteSectionProps } from "@solidjs/router";

export default function ShopLayout(props: RouteSectionProps) {
	const [drawerOpen, setDrawerOpen] = createSignal(false);
	// Deliberately client-only. This layout wraps the ISR-cached shop routes,
	// and their cache key has no notion of the cart cookie — resolving the cart
	// during SSR would bake one visitor's cart into HTML served to everyone.
	// `/_/shop/cart` renders it server-side itself and is excluded from ISR.
	const confirmedCart = createAsync(() =>
		isServer ? Promise.resolve(null) : getCart(),
	);
	const optimistic = useOptimisticCart(confirmedCart);

	return (
		<>
			<Link rel="preconnect" href="https://cdn.shopify.com" />
			<Link rel="preconnect" href="https://mock.shop" />

			<div class="fixed top-24 right-6 z-[120]">
				<button
					type="button"
					class="rounded-full border bg-white px-4 py-2 shadow-sm"
					onClick={() => setDrawerOpen(true)}
				>
					Cart ({optimistic.cart()?.totalQuantity ?? 0})
				</button>
			</div>

			{props.children}

			<CartDrawer
				open={drawerOpen()}
				onClose={() => setDrawerOpen(false)}
				cart={optimistic.cart}
				isLinePending={optimistic.isLinePending}
				isLineOptimistic={optimistic.isLineOptimistic}
			/>
		</>
	);
}
