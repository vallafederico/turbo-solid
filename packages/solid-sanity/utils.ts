import { SanityDocumentStub } from "@sanity/client"

interface SanityLinkProps {
  url: string
  label: string
  linkType: 'internal' | 'external'
  page?: {
    _type: string
    slug: {
      current: string
      fullUrl?: string
    }
  }
  advanced?: {
    noFollow?: boolean
    noReferrer?: boolean
  }
}

export const sanityLink = (props: SanityLinkProps) => { 
  const { url, label, linkType, page, advanced } = props
  const isExternal = linkType === 'external'
  let rel = undefined as string | undefined
  if (isExternal) {
    if (advanced?.noFollow) {
      rel = 'noopener noreferrer'
    } else {
      rel = 'noopener'
    }
  }
  return {
    _target: isExternal ? '_blank' : undefined,
    linkType,
    label,
    rel,
    url: isExternal ? url : undefined,
    href: isExternal ? url : (page?.slug?.fullUrl || page?.slug?.current),
  }
}
  