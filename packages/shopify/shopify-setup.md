```ts


import { defineConfig } from '@solidjs/start/config'
import { qrcode } from 'vite-plugin-qrcode'
import graphqlLoader from 'vite-plugin-graphql-loader'
import codegen from 'vite-plugin-graphql-codegen'

export default defineConfig({
	// your config here

	vite: {
		plugins: [
			graphqlLoader(),
			codegen({
				throwOnBuild: false,
				runOnBuild: false,
				config: {
					schema: '../../packages/shopify/schema.graphql',
					watch: '../../packages/shopify/**/*.{ts,tsx,graphql,gql}',
					documents: '../../packages/shopify/graphql/**/*.{graphql,gql}',
					generates: {
						'../../packages/shopify/types/storefront.generated.ts': {
							plugins: ['typescript', 'typescript-operations'],
						},
					},
				},
			}),
		],
	},
})



```