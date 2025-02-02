import {getExtension, getImageDimensions} from '@sanity/asset-utils'

export default {
  name: 'settings.seo',
  title: 'SEO',
  type: 'document',
  groups: [
    {
      name: 'meta',
      title: 'Metadata',
      default: true,
    },
    {
      name: 'social',
      title: 'Social Media Metadata',
    },
  ],
  fields: [
    {
      name: 'siteUrl',
      title: 'Site URL',
      group: 'meta',
      type: 'url',
      description: 'The base URL of the site, including the protocol (e.g. https://)',
    },
    {
      name: 'siteTitle',
      type: 'string',
      group: 'meta',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      type: 'text',
      title: 'Meta Description',
      description: 'Default meta description if not filled in on each page.',
      group: 'meta',
      rows: 3,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'favicon',
      type: 'image',
      group: 'meta',
      description:
        'The icon that appears in the browser tab, USE AN SVG WHEREVER POSSIBLE. Must be below 10Kb. If not using an SVG must be 32px x 32px.',
    },
    {
      name: 'socialDescription',
      title: 'Social Media Description',
      type: 'text',
      rows: 3,
      description:
        'The description displayed when this pages link is posted on social media. Defaults to the Meta Description already provided',
    },
    {
      name: 'metaImage',
      title: 'Meta Image',
      description:
        'Displayed when the site link is posted on social media, defaults to a screenshot of the homepage.',
      type: 'imageAlt',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'SEO',
      }
    },
  },
}
