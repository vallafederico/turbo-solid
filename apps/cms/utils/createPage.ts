import {pageDefaultsGroups, pageDefaultsSeo} from './_pageDefaults'
import {HiDocumentText} from 'react-icons/hi'
import {IconType} from 'react-icons/lib'
import {FieldDefinition, FormFieldGroup} from 'sanity'
import {SlugInput} from 'sanity-plugin-prefixed-slug'

type PageAttributes = {
  title: string
  name: string
  tabs?: boolean
  icon?: IconType
  slug?: string | false
  groups?: FormFieldGroup[]
  slices?: boolean | string
  orderings?: any[]
  prefix?: string // Add prefix to slug, i.e "/blog/..."
  seo?: boolean // Add SEO attributes to page
  body?: boolean // Adds a rich text field for text-based pages
  fields?: Array<FieldDefinition> // Add extra fields on top of defaults
}

const addDefaultGroups = (fields: Array<FieldDefinition>) => {
  return fields.map((field) => {
    if (!field.group) {
      field.group = 'content'
    }

    return field
  })
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const defaultOptions = {
  slug: true,
  seo: true,
  slices: true,
  icon: HiDocumentText,
}

export const createPage = (opts: PageAttributes) => {
  const options = {...defaultOptions, ...opts}
  const allFields = []
  const {
    title,
    name,
    seo,
    slug,
    prefix,
    icon,
    body,
    fields = [],
    preview,
    groups,
    orderings,
    slices,
  } = options

  if (body) {
    allFields.push({
      name: 'body',
      group: 'content',
      type: 'body',
    })
  }

  if (seo !== false) {
    allFields.push(...pageDefaultsSeo)
  }

  if (slug && !prefix) {
    allFields.unshift({
      name: 'slug',
      description: 'Click generate to build a URL for this page.',
      title: 'Slug',
      type: 'slug',
      initialValue: slugify(title),
      components: {
        input: prefix ? SlugInput : undefined,
      },
      options: {
        source: 'title',
        urlPrefix: `${prefix || slugify(title)}/`,
        storeFullUrl: true,
      },
      validation: (Rule) => Rule.required().error('This page needs a slug'),
    })
  }
  if (title) {
    allFields.unshift({
      name: 'title',
      initialValue: prefix ? '' : title,
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
      title: 'Page Title',
    })
  }

  if (slices) {
    allFields.push({
      name: 'slices',
      title: 'Slices',
      group: 'content',
      type: typeof slices === 'string' ? slices : 'pageSlices',
    })
  }

  const page = {
    type: 'document',
    title,
    name,
    icon,
    groups: [...pageDefaultsGroups, ...(groups || [])].sort((a, b) =>
      a.title.localeCompare(b.title),
    ),
    fields: addDefaultGroups([...allFields, ...fields]),
    preview: preview || {
      select: {
        title: 'title',
        slug: 'slug',
      },
      prepare(select) {
        const {title, slug} = select
        return {
          title,
          subtitle: slug && prefix && (slug.fullUrl || slug.current || ''),
          icon,
        }
      },
    },
    orderings,
  }

  return page
}

export default createPage
