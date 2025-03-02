import {MdTextFormat} from 'react-icons/md'
import {createPreview} from '../../utils/preview'

export default {
  name: 'richText',
  icon: MdTextFormat,
  title: 'Rich Text',
  type: 'object',
  preview: createPreview('{Rich Text}'),
  fields: [
    {
      name: 'body',
      type: 'blockContent',
    },
  ],
}
