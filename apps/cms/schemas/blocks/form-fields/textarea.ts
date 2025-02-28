import {MdTextFormat} from 'react-icons/md'
import {FIELD_PREVIEW, DEFAULT_FORM_FIELDS, PLACEHOLDER_FIELD} from './field-defaults'

export default {
  name: 'textarea',
  icon: MdTextFormat,
  title: 'Textarea (Mulitline Text)',
  type: 'object',
  fields: [...DEFAULT_FORM_FIELDS, PLACEHOLDER_FIELD],
  preview: FIELD_PREVIEW,
}
