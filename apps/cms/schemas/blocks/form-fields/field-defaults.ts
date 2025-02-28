import {MdEmail, MdPhone, MdNumbers, MdLink} from 'react-icons/md'

import {MdCancel} from 'react-icons/md'

export const FIELD_PREVIEW = {
  select: {
    label: 'label',
    required: 'required',
  },
  prepare({label, required}: {label: string; required: boolean}) {
    return {
      title: `${label || 'Unnamed Field'}`,
      subtitle: `${required ? 'Required' : 'Optional'}`,
    }
  },
}

export const VALIDATION_TYPES = [
  {
    title: 'None',
    icon: MdCancel,
    value: 'none',
  },
  {
    title: 'Email',
    icon: MdEmail,
    value: 'email',
  },
  {
    name: 'number',
    title: 'Number',
    icon: MdNumbers,
    value: 'number',
  },
  {
    title: 'Phone',
    value: 'tel',
    icon: MdPhone,
  },
  {
    title: 'URL',
    icon: MdLink,
    value: 'url',
  },
]

export const DEFAULT_FORM_FIELDS = [
  {
    name: 'label',
    type: 'string',
    title: 'Label',
    validation: (Rule: any) => Rule.required(),
  },
  {
    name: 'required',
    title: 'Required',
    type: 'boolean',
    initialValue: false,
  },
]

export const PLACEHOLDER_FIELD = {
  type: 'string',
  name: 'placeholder',
  validation: (Rule: any) => Rule.required(),
  description: 'The placeholder text for the field, defaults to the label if not provided.',
}

export const AUTOCOMPLETE_TYPES = [
  {title: 'Off', value: 'off'},
  {title: 'Name', value: 'name'},
  // {title: 'Email', value: 'email'},
  {title: 'Street Address', value: 'street-address'},
  {title: 'Address Line 1', value: 'address-line1'},
  {title: 'Address Line 2', value: 'address-line2'},
  {title: 'Address Line 3', value: 'address-line3'},
  {title: 'City', value: 'address-level2'},
  {title: 'State/Province', value: 'address-level1'},
  {title: 'Postal Code', value: 'postal-code'},
  {title: 'Country', value: 'country'},

  {title: 'Language', value: 'language'},
  {title: 'Birthday', value: 'bday'},
  {title: 'Birthday Day', value: 'bday-day'},
  {title: 'Birthday Month', value: 'bday-month'},
  {title: 'Birthday Year', value: 'bday-year'},
  {title: 'Gender', value: 'sex'},
  // Usually you want tel, but we have a validation type that handles this
  // { title: 'Phone', value: 'tel' },
  // { title: 'Phone Country Code', value: 'tel-country-code' },
  // { title: 'Phone National', value: 'tel-national' },
  // { title: 'URL', value: 'url' },
  // { title: 'Photo', value: 'photo' },
  {title: 'Given Name', value: 'given-name'},
  {title: 'Family Name', value: 'family-name'},
  {title: 'Middle Name', value: 'additional-name'},
  {title: 'Nickname', value: 'nickname'},
  // { title: 'Honorific Prefix', value: 'honorific-prefix' },
  // { title: 'Honorific Suffix', value: 'honorific-suffix' },
  {title: 'Job Title', value: 'organization-title'},
  {title: 'Company', value: 'organization'},
  // { title: 'Fax', value: 'fax' }, // nah
  {title: 'Home Phone', value: 'home tel'},
  {title: 'Work Phone', value: 'work tel'},
  {title: 'Mobile Phone', value: 'mobile tel'},
  {title: 'Home Email', value: 'home email'},
  {title: 'Work Email', value: 'work email'},
]
