import type { JSX } from 'solid-js/h/jsx-runtime'
import { useCart } from '../context'
import { shopifyCurrency } from '../utils'

export default function CartTotalAmount({
	class: className,
	...rest
}: { class?: string } & JSX.HTMLAttributes<HTMLDivElement>) {
	const { totalAmount } = useCart()
	console.log('totalAmount::', totalAmount())

	return (
		<div class={className} {...rest}>
			{shopifyCurrency(totalAmount())}
		</div>
	)
}
