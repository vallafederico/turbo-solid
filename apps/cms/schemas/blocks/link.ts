import LinkOptions from '../../components/LinkOptions/LinkOptions'
import LinkTypeSelector from '../../components/LinkTypeSelector'
import pages from '../pages'
import {CgExternal} from 'react-icons/cg'
import {MdEmail, MdLink, MdPhone} from 'react-icons/md'

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
    input: LinkOptions,
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
      name: 'prefix',
      type: 'string',
      initialValue: 'mailto:',
      options: {
        list: [
          {
            title: 'Email',
            value: 'mailto:',
            icon: MdEmail,
          },
          {
            title: 'Phone',
            value: 'tel:',
            icon: MdPhone,
          },
        ],
      },
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
    {
      name: 'page',
      type: 'reference',
      to: [...allPages],
      hidden: ({parent}) => parent?.linkType !== 'internal',
    },
    {
      name: 'advanced',
      hidden: ({parent}) => parent?.linkType !== 'external',
      description: 'Only available for external links',
      type: 'object',
      options: {
        columns: 2,
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'noFollow',
          type: 'boolean',
          title: 'No Follow',
          initialValue: false,
        },
        {
          name: 'noReferrer',
          type: 'boolean',
          initialValue: false,
          title: 'No Referrer',
        },
        // {
        //   name: 'newTab',
        //   type: 'boolean',
        //   title: 'New Tab',
        //   description:
        //     'If true, the link will open in a new tab. Defaults to true for external links',
        // },
      ],
    },
  ],
}
