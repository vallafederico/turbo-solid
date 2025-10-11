import { query } from '@solidjs/router'
import { GetProducts, GetProductByHandle } from '../graphql/Products.graphql'
import type { Product, ProductOption, ProductVariant } from '../types'
import { shopifyQuery } from './query'

export const getProducts = query(async () => {
	'use server'
	return await shopifyQuery(GetProducts, {
		variables: {
			first: 25,
		},
	}).then((res) => {
		return res?.data?.products?.nodes as Product[]
	})
}, 'products')

export const getProductByHandle = async (handle: string) => {
	return await shopifyQuery(GetProductByHandle, {
		variables: {
			handle,
		},
	}).then((res) => {
		return res?.data?.product
	})
}

export const variantOptionsToObject = (options: ProductOption[]) => {
	if (options.length === 0) {
		return {}
	}

	return options.reduce(
		(acc, option) => {
			acc[option.name] = option.value
			return acc
		},
		{} as Record<string, string>,
	)
}

export const variantFromOptions = (
	variants: ProductVariant[],
	selectedOptions: Record<string, string>,
) => {
	const opts = selectedOptions

	// Get array of selected option keys/values
	const selectedEntries = Object.entries(opts)

	return variants.find((variant) => {
		// Convert variant's selectedOptions array to key/value pairs
		const variantOptionPairs = variant.selectedOptions.map((opt) => [
			opt.name,
			opt.value,
		])

		// Check if all selected options match this variant's options
		return selectedEntries.every(([selectedKey, selectedValue]) => {
			return variantOptionPairs.some(
				([variantKey, variantValue]) =>
					variantKey === selectedKey && variantValue === selectedValue,
			)
		})
	}) as ProductVariant
}

export const attributesToArray = (attributes: Record<string, string>) => {
	return Object.keys(attributes).map((key) => ({
		key: key,
		value: attributes[key],
	}))
}
