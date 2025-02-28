import {MdArrowDropDownCircle} from 'react-icons/md'
import {DEFAULT_FORM_FIELDS} from './field-defaults'

export default {
  type: 'object',
  icon: MdArrowDropDownCircle,
  name: 'selectInput',
  fields: [
    ...DEFAULT_FORM_FIELDS,
    {
      name: 'options',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
    },
  ],
}
