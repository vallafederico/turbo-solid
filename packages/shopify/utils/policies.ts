import { shopifyQuery } from './query'
import { GetShopPolicies } from '../graphql/Policies.graphql'

export const getPolicies = async () => {
	'use server'
	const policies = await shopifyQuery(GetShopPolicies)

	return policies?.data?.shop
}
