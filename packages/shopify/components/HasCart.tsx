import { Show } from 'solid-js'

export function HasCart({
	children,
	fallback = undefined,
}: {
	children: any
	fallback?: any
}) {
	// const { cartId } = useCart()

	return (
		<Show when={true} fallback={fallback}>
			{children}
		</Show>
	)
}
