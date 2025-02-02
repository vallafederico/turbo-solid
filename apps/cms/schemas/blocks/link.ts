import LinkTypeSelector from '../../components/LinkTypeSelector'
import pages from '../pages'
import {CgExternal} from 'react-icons/cg'
import {MdLink} from 'react-icons/md'

const excludedTypes = []

const allPages = pages
  .filter((p) => p?.name && excludedTypes.indexOf(p.name) === -1)
  .map((page, i) => {
    return {
      type: page.name,
      name: page.name,
    }
  })

export default {
  type: 'object',
  name: 'link',
  components: {
    input: LinkTypeSelector,
  },
  options: {
    noLabel: true,
  },
  preview: {
    select: {
      title: 'linkType',
      url: 'url',
      label: 'label',
      page: 'page._ref',
    },
    prepare({title, url, page, label}) {
      return {
        title: label,
        icon: title.toLowerCase() === 'internal' ? CgExternal : MdLink,
      }
    },
  },
  fields: [
    {
      name: 'linkType',
      type: 'string',
      initialValue: 'internal',
    },
    {
      name: 'label',
      type: 'string',
    },
    {
      name: 'url',
      type: 'url',
      title: 'URL',
      description: 'Must start with https://',
      hidden: ({parent}) => parent?.linkType === 'internal',
    },
    // {
    //   name: 'page',
    //   type: 'reference',
    //   to: [...allPages],
    //   hidden: ({parent}) => parent?.linkType !== 'internal',
    // },
  ],
}
