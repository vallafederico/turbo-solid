import styles from './shopify-text.module.css'

export default function ShopifyText({
	text,
	class: className,
}: { text: string; class: string }) {
	return (
		<div
			class={`text-16 [&_h2]:text-19 text-justify [&_h2]:mb-3 [&_h2]:font-bold [&_strong]:font-bold [&_p]:opacity-70 [&_p]:!mb-30 ${className} ${styles.text}`}
			innerHTML={text}
		/>
	)
}
