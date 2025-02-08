import { MdArticle, MdSearch } from "react-icons/md"

export const pageDefaultsGroups = [
  {
    name: 'social',
    title: 'Social Media',
  },
  {
    name: 'content',
    title: 'Content',
    icon: MdArticle,
    default: true,
  },
  {
    name: 'seo',
    title: 'SEO',
    icon: MdSearch,
  },
]

export const pageDefaultsSeo = [
  {
    name: 'meta',
    title: "Metadata",
    group: 'seo',
    type: 'object',
    fields: [
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        rows: 3,
        description:
          'The description displayed when a user finds the site in search results. Defaults to the description provided in Settings > SEO.',
        validation: (Rule) =>
          Rule.max(160).warning('Long titles (over 160 characters) will be truncated by Google.'),
      },
      {
        name: 'metaImage',
        title: 'Meta Image',
        description:
          'Displayed when the site link is posted on social media, defaults to a screenshot of the homepage.',
        type: 'imageAlt',
      },
      
    ]
  }
]
