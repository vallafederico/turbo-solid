import {MdFormatQuote} from 'react-icons/md'

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
  ],
  preview: {
    prepare() {
      return {
        title: 'Pullquote',
      }
    },
  },
}
