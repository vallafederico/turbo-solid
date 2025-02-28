import { urlFor } from '../utils/assets'
import type { SanityImageProps } from '../types'

export default function SanityImage({
	src,
	mobileWidth,
	desktopWidth,
	alt,
	priority,
	class: className,
	...rest
}: SanityImageProps) {
	const emptyImage =
		'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

	const IS_RICH_IMAGE = typeof src?.asset?.url === 'string' // means it has been de-referenced

	const base = IS_RICH_IMAGE ? src.asset : src?._id

	const quality = 77
	const altText = src?.asset?.altText || alt || ''

	let assetType: string
	let assetId: string
	let imageRes: string
	let fileType: string
	let imageWidth: number
	let imageHeight: number

	if (IS_RICH_IMAGE) {
		assetType = src.asset.assetType
		assetId = src.asset.assetId
		imageRes = src.asset.imageRes
		fileType = src.asset.fileType

		imageWidth = src.asset.metadata.dimensions.width
		imageHeight = src.asset.metadata.dimensions.height
	} else {
		const [_assetType, _assetId, _imageRes, _fileType] = base?._ref.split('-')

		const [w, h] = _imageRes.split('x').map((x) => Number.parseInt(x))

		imageWidth = w
		imageHeight = h

		if (!_assetType || !_assetId || !_imageRes || !_fileType) {
			throw new Error('Invalid image reference')
		}

		assetType = _assetType as string
		assetId = _assetId as string
		imageRes = _imageRes as string
		fileType = _fileType as string
	}

	const aspectRatio = imageWidth / imageHeight
	const crop = base?.crop

	const w = Math.ceil(
		crop ? (1 - crop.left - crop.right) * imageWidth : imageWidth,
	)
	const h = Math.ceil(
		crop ? (1 - crop.top - crop.bottom) * imageHeight : imageHeight,
	)

	// viewport widths that image sizes attribute will use
	const responsiveWidths = [20, 50, 100, 320, 640, 960, 1200, 1920, 2160]

	const imageUrl = urlFor(IS_RICH_IMAGE ? src.asset : src._id)
		.size(w | 0, (w / aspectRatio) | 0)
		.fit('crop')
		.auto('format')
		.quality(quality)
		.url()

	const sizeLoader = () => {
		let sizes = ''
		responsiveWidths.forEach((width, index) => {
			const w = width | 0
			const h = (width / aspectRatio) | 0

			const url = urlFor(base)
				.size(w, h)
				.fit('crop')
				.auto('format')
				.quality(quality)

				.url()

			const string = `${url} ${width}w${
				index + 1 === responsiveWidths.length ? '' : ', '
			}`
			sizes += string
		})
		return sizes
	}

	return (
		<img
			src={imageUrl || emptyImage}
			width={Math.ceil(w)}
			alt={altText}
			height={Math.ceil(h)}
			class={className}
			loading={priority ? 'eager' : 'lazy'}
			srcset={sizeLoader()}
			draggable={false}
			sizes={
				assetType === 'svg'
					? '100vw'
					: `(max-width:767px) ${mobileWidth || 70}vw, ${desktopWidth || 100}vw`
			}
			decoding={priority ? 'sync' : 'async'}
		/>
	)
}
