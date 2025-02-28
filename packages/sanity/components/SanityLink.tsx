import { SanityLinkProps } from '../types'
import { sanityLink } from '../utils/link'
import { Dynamic} from 'solid-js/web'

type LinkProps = {
  tag?: string
  class?: string
  children?: any
} & SanityLinkProps

export default function SanityLink({class: className, tag, children, ...props}: LinkProps) {

  const element = tag || 'a'
  const { label, attrs } = sanityLink(props)

  return <Dynamic  component={element} {...attrs} {...props} class={className}>{children || label}</Dynamic>
}
