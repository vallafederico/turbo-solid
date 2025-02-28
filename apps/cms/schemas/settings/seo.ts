import {AiFillRobot} from 'react-icons/ai'

export default {
  name: 'seo',
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
    {
      name: 'robots',
      title: 'Robots',
      type: 'array',
      group: 'meta',
      description:
        'Optional, if you want to specify specific rules for different user agents. This defaults to allowing access to all routes.',
      of: [
        {
          type: 'object',
          icon: AiFillRobot,
          preview: {
            select: {
              userAgent: 'userAgent',
              allow: 'allow',
              disallow: 'disallow',
            },
            prepare({userAgent, allow, disallow}) {
              return {
                title: 'Agent: ' + (userAgent || ''),
                subtitle: `Allow: ${allow}, Disallow: ${disallow}`,
              }
            },
          },
          fields: [
            {
              name: 'userAgent',
              type: 'string',
              options: {
                list: [
                  {title: 'All', value: '*'},
                  {title: 'Googlebot', value: 'googlebot'},
                  {title: 'Bingbot', value: 'bingbot'},
                  {title: 'Baiduspider', value: 'baiduspider'},
                  {title: 'Yandexbot', value: 'yandexbot'},
                ],
              },
            },
            {
              name: 'allow',
              title: 'Allow',
              type: 'string',
            },
            {
              name: 'disallow',
              title: 'Disallow',
              type: 'string',
            },
          ],
        },
      ],
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
