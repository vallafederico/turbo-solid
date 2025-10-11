import { shopifyQuery } from './query'
import {
	CartCreate,
	CartLinesAdd,
	CartLinesUpdate,
	CartLinesRemove,
} from '../graphql/Cart.graphql'
import type { CartTransform } from '../types'

export const createCart = async () => {
	console.log('createCart::')
	return await shopifyQuery(CartCreate).then((res) => {
		return res?.data?.cartCreate?.cart as CartTransform
	})
}

export const addCartLineItem = async (cartId: string, lineItems: any[]) => {
	console.log('addCartLineItem::', { cartId, lineItems })
	return await shopifyQuery(CartLinesAdd, {
		variables: {
			cartId,
			lines: lineItems,
		},
	}).then((res) => {
		console.log('res::', res)
		return res?.data?.cartLinesAdd?.cart as CartTransform
	})
}

export const cartIncludesVariant = (cart: CartTransform, variantId: string) => {
	return cart.lines.some((line) => line.merchandise.id === variantId)
}

export const updateCartLineItem = async (cartId: string, lineItems: any[]) => {
	return await shopifyQuery(CartLinesUpdate, {
		variables: {
			cartId,
			lines: lineItems,
		},
	}).then((res) => {
		return res?.data?.cartLinesUpdate?.cart as CartTransform
	})
}

export const removeCartLineItems = async (
	cartId: string,
	lineItemIds: string[],
) => {
	return await shopifyQuery(CartLinesRemove, {
		variables: {
			cartId,
			lineIds: lineItemIds,
		},
	}).then((res) => {
		return res?.data?.cartLinesRemove?.cart as CartTransform
	})
}
