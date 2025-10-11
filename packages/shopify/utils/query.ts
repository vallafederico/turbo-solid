import type { DocumentNode } from 'graphql'
import { SHOPIFY_CLIENT } from '../client'
import { print } from 'graphql'

export const shopifyQuery = (
	query: DocumentNode,
	variables: Record<string, any> = {},
) => {
	if (!query.loc?.source.body) {
		throw new Error(
			'❌ Query is not a valid AST document, check the query syntax',
		)
	}

	return SHOPIFY_CLIENT.fetch(print(query), variables).then(async (res) => {
		const d = await res.json()

		if (d?.errors) {
			console.error(d.errors)
			return null
		}

		return d
	})
}
