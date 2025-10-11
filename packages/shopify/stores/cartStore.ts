import { createStore } from 'solid-js/store'
import type { Product } from '../types/storefront.generated'

export const [cartStore, setCartStore] = createStore({
	items: [] as Product[],
	totalQuantity: 0,
	checkoutUrl: null,
	id: null,
	totalAmount: 0,
})
