import {createPreview} from '../../utils/preview'

export default {
  name: 'formSlice',
  icon: null,
  type: 'object',
  fields: [
    {
      name: 'text',
      type: 'text',
      rows: 1,
    },
    {
      name: 'fields',
      type: 'array',
      of: [
        {
          type: 'textInput',
          name: 'textInput',
        },
        {
          type: 'textareaInput',
          name: 'textareaInput',
        },
        {
          type: 'selectInput',
          name: 'selectInput',
        },
      ],
    },
  ],
  preview: createPreview('{FormSlice}'),
}
