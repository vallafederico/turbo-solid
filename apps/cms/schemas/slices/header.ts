import {createPreview} from '../../utils/preview'

export default {
  name: 'header',
  icon: null,
  type: 'object',
  fields: [
    {
      name: 'text',
      type: 'text',
      rows: 1,
    },
    {
      name: 'link',
      type: 'link',
    },
  ],
  preview: createPreview('{Header}'),
}
