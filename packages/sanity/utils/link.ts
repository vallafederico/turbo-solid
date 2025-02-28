import type { SanityLinkProps } from '../types'

export const sanityLink = (props: SanityLinkProps) => { 
  const { url, label, linkType, slug, advanced } = props || {}
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
    linkType,
    label,
    isExternal,
    url: isExternal ? url : undefined,
    attrs: {
      rel,
      _target: isExternal ? '_blank' : undefined,
      href: isExternal ? url : (slug?.fullUrl || slug?.current),
    }
  }
}
  