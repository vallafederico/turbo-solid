import {createPreview} from '../../utils/preview'

export default {
  name: 'socials',
  title: 'Socials',
  preview: createPreview('name', 'url', 'icon'),
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'image',
    },
  ],
}
