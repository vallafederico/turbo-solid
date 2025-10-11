import type { ResponsiveImageFragment } from '../types/storefront.generated'

export const shopfiyImage = (media: ResponsiveImageFragment) => {
	const w = media?.image?.width || 0
	const h = media?.image?.height || 0

	return {
		url: media?.image?.url,
		width: w,
		height: h,
		aspectRatio: w / h,
	}
}
