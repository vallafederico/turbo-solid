import type { SanityImageAssetDocument } from '@sanity/client'

export type SanityImageProps = {
	src: SanityImageAssetDocument
	mobileWidth?: number | string
	desktopWidth?: number | string
	alt?: string
	priority?: boolean
	class?: string
}

export type SanityDocumentGetterOptions  = {
	filter?: string | null
	extraQuery?: string | null
	params?: {
		[key: string]: any
	}
}

export type SanityLinkProps = {
  url: string
  label: string
  linkType: "internal" | "external"
  slug: {
    current: string
    fullUrl?: string
    docType: string
  }
  advanced?: {
    noFollow?: boolean
    noReferrer?: boolean
  }
}