import { DEFAULT_CURRENCY } from '../config.shopify'
import type { MoneyV2 } from '../types'

const parseShopifyAmount = (amount: string) => {
	return typeof amount === 'string' ? Number.parseFloat(amount) : amount
}

export const shopifyCurrency = (currency: MoneyV2) => {
	const { amount = 0, currencyCode = DEFAULT_CURRENCY } = currency || {}

	const amountNumber = parseShopifyAmount(amount)

	const formattedAmount = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currencyCode,
		useGrouping: false,
	}).format(amountNumber)

	// if (trimDecimals && formattedAmount.includes('.00')) {
	// 	console.log('formattedAmount::', formattedAmount)
	// 	return formattedAmount.replace('.00', '')
	// }

	return formattedAmount
}

export const shopifyCurrencyDelta = (value1: MoneyV2, value2: MoneyV2) => {
	const currencyCode =
		value1.currencyCode || value2.currencyCode || DEFAULT_CURRENCY

	const v1 = parseShopifyAmount(value1?.amount || 0)
	const v2 = parseShopifyAmount(value2?.amount || 0)

	const delta = v1 - v2

	return shopifyCurrency({
		amount: delta,
		currencyCode,
	})
}
