import {MdTextFormat} from 'react-icons/md'

export default {
  name: 'richText',
  icon: MdTextFormat,
  title: 'Rich Text',
  type: 'object',
  fields: [
    {
      name: 'body',
      type: 'blockContent',
    },
  ],
}
