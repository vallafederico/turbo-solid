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
        title: 'Description Override',
        type: 'text',
        rows: 3,
        description:
          'The description displayed when a user finds the site in search results. Defaults to the description provided in Settings > SEO.',
        validation: (Rule) =>
          Rule.max(160).warning('Long titles (over 160 characters) will be truncated by Google.'),
      },
      {
        name: 'title',
        title: 'Social Media Title',
        type: 'string',
        description:
          'The title displayed when this pages link is posted on social media. Defaults to the Page Title already provided',
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
      
    ]
  }
]
