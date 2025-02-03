import {MdFormatQuote} from 'react-icons/md'
import {createPreview} from '../../utils/preview'

export default {
  name: 'pullquote',
  icon: MdFormatQuote,
  type: 'object',
  fields: [
    {
      name: 'text',
      type: 'text',
      rows: 4,
    },
    {
      name: 'thingy',
      type: 'object',
      fields: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'age',
          type: 'number',
        },
      ],
    },
  ],
  preview: createPreview('{Pullquote}'),
}
