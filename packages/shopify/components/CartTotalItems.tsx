import type { JSX } from 'solid-js/h/jsx-runtime'
import { useCart } from '../context'

export default function CartTotalItems({
	class: className,
	suffix,
	...rest
}: { suffix?: string; class?: string } & JSX.HTMLAttributes<HTMLDivElement>) {
	const { totalQuantity } = useCart()

	return (
		<div class={className} {...rest}>
			{totalQuantity()} {suffix}
		</div>
	)
}
