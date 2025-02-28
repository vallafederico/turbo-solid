import {MdTextFields} from 'react-icons/md'
import {
  FIELD_PREVIEW,
  AUTOCOMPLETE_TYPES,
  DEFAULT_FORM_FIELDS,
  PLACEHOLDER_FIELD,
  VALIDATION_TYPES,
} from './field-defaults'
import ButtonSelector from '../../../components/ButtonSelector'

export default {
  name: 'textInput',
  title: 'Text Input',
  icon: MdTextFields,
  type: 'object',
  preview: FIELD_PREVIEW,
  fields: [
    {
      name: 'validation',
      components: {
        input: ButtonSelector,
      },
      initialValue: 'none',
      description:
        'Optional. Sets the type of data a user should input. If selected, the autocomplete field will be hidden and filled in automatically.',
      type: 'string',
      options: {
        list: VALIDATION_TYPES,
      },
    },
    ...DEFAULT_FORM_FIELDS,
    {
      name: 'autocomplete',
      hidden: ({parent}) => parent?.validation !== 'none',
      description:
        'If on, he browser will give the user suggestions based on the type of data they should be entering here. Optional but nice to have.',
      title: 'Autocomplete',
      type: 'string',
      initialValue: 'off',
      options: {list: AUTOCOMPLETE_TYPES},
    },
    PLACEHOLDER_FIELD,
  ],
}
