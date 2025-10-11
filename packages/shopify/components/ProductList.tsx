import { For, Show, type JSXElement } from 'solid-js'

import { createAsync, query } from '@solidjs/router'
import { getProducts } from '../utils'
import { useCart } from '../context'

interface ProductListProps {
	children: (item: any, index: number) => JSXElement
	fetcher?: () => Promise<any>
	type?: 'product' | 'cart'
	fallback?: () => JSXElement
	class?: string
}

export function ProductList({
	children,
	type = 'product',
	fallback = () => null,
	class: className,
}: ProductListProps) {
	const { lineItems } = useCart()

	const result = createAsync(() => {
		switch (type) {
			case 'product':
				return getProducts()
			// case 'cart':
			// 	console.log('lineItems::', lineItems())
			// 	return Promise.resolve(lineItems())
			// default:
			// 	return []
		}
	})

	return (
		<Show fallback={fallback()} when={result()}>
			{(data) => {
				return (
					<ul class={className}>
						<For each={data()}>
							{(item, index) => {
								return children({ ...item, index: index() })
							}}
						</For>
					</ul>
				)
			}}
		</Show>
	)
}
