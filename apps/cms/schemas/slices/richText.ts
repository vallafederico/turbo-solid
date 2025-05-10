import {createPreview} from '../../utils/preview'

export default {
    name: 'richText',
    icon: null,
    type: 'object',
    fields: [
        {
        name: 'text',
        type: 'text',
        rows: 1,
        },
    ],
    preview: createPreview('{RichText}'),
}