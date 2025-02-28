import type { SanityImageAssetDocument } from '@sanity/client'
import { JSX } from 'solid-js'

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

export type BaseInputProps = {
  label: string
  placeholder: string
  required: boolean
  class?: string
}