import { createContext, onMount, useContext } from 'solid-js'
import type { CartTransform, MoneyV2 } from '../types'
import {
	addCartLineItem,
	createCart,
	removeCartLineItems,
	updateCartLineItem,
} from '../utils'
import { getLocalStorage, setLocalStorage } from '../utils/storage'
import { createStore } from 'solid-js/store'

interface CartStore {
	id: string | null
	totalQuantity: number
	items: any[]
	totalAmount: MoneyV2
	checkoutUrl: string | null
}

const [cart, setCart] = createStore<CartStore>({
	id: null,
	totalQuantity: 0,
	items: [],
	checkoutUrl: null,
	totalAmount: {
		amount: 0,
		currencyCode: 'USD',
	},
})

const sync = (c: CartTransform) => {
	if (!c) return
	setCart('id', c.id as string)
	setCart('totalQuantity', c.totalQuantity)
	setCart('items', c.lines?.nodes)
	setCart('totalAmount', c.cost?.totalAmount)
	setCart('checkoutUrl', c.checkoutUrl)

	setLocalStorage('shopify_cart', JSON.stringify(c))
}

const updateItem = async (lineItemId: string, quantity: number) => {
	const matchingItem = cart.items.find((item) => item.id === lineItemId)

	const updatedItem = {
		id: matchingItem.id,
		quantity,
	}

	if (!cart.id) return
	return await updateCartLineItem(cart.id, [updatedItem]).then(async (res) => {
		sync(res)
	})
}

const removeItem = async (lineItemId: string) => {
	if (!cart.id) return
	return await removeCartLineItems(cart.id, [lineItemId]).then(async (res) => {
		sync(res)
	})
}

const addItem = async (lineItems: any[]) => {
	const cartId = cart.id

	if (!cartId) return

	return await addCartLineItem(cartId, lineItems).then(async (res) => {
		console.log('res add::', res)
		sync(res)
	})
}

const CartContext = createContext({
	addItem,
	updateItem,
	removeItem,
	lineItems: () => cart.items,
	totalQuantity: () => cart.totalQuantity,
	totalAmount: () => cart.totalAmount,
	checkoutUrl: () => cart.checkoutUrl,
})

export const useCart = () => {
	const ctx = useContext(CartContext)
	if (!ctx) {
		throw new Error('useCart must be used within a CartProvider')
	}

	return ctx
}

export const CartProvider = ({
	children,
}: {
	children: any
}) => {
	const getOrCreateCart = async () => {
		let c = getLocalStorage('shopify_cart')

		if (c) {
			c = JSON.parse(c as string)
			sync(c)
			return Promise.resolve()
		}
		c = await createCart()
		sync(c)
	}

	onMount(() => {
		getOrCreateCart()
	})

	return (
		<CartContext.Provider
			value={{
				cart,
				addItem,
				lineItems: () => cart.items,
				totalQuantity: () => cart.totalQuantity,
				checkoutUrl: () => cart.checkoutUrl,
			}}
		>
			{children}
		</CartContext.Provider>
	)
}
