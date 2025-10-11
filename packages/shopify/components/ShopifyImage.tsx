import type {
	MediaImage,
	ResponsiveImageFragment,
} from '../types/storefront.generated'
import { shopfiyImage } from '../utils/image'

interface ShopifyImageProps {
	src: ResponsiveImageFragment
	priority?: boolean
	mobileWidth?: number
	desktopWidth?: number
	class?: string
}

export function ShopifyImage({
	src,
	mobileWidth = 70,
	desktopWidth = 100,
	priority = false,
	class: className,
}: ShopifyImageProps) {
	let assetType = 'image'

	const base = src
	const emptyImage =
		'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

	const { url, width, height } = shopfiyImage(src)

	if (base?.size_390?.split('.').pop()?.includes('svg')) {
		assetType = 'svg'
	}

	const srcSetLoader = () => {
		if (!base?.url) {
			return undefined
		}

		const sizes = Object.entries(base)
			.filter(([key]) => key.startsWith('size_'))
			.map(([key, value]) => {
				const width = key.split('_').pop()

				return `${value} ${width}w`
			})
			.join(', ')

		return `${emptyImage} 1w, ${sizes}`
	}

	return (
		<img
			class={className}
			width={width}
			height={height}
			srcSet={srcSetLoader()}
			sizes={
				assetType === 'svg'
					? '100vw'
					: `(max-width:767px) ${mobileWidth}vw, ${desktopWidth}vw`
			}
			src={url || emptyImage}
			alt={base?.altText || ''}
			decoding={priority ? 'sync' : ('async' as const)}
			loading={priority ? 'eager' : ('lazy' as const)}
		/>
	)
}
