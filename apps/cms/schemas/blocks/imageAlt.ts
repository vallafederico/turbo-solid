import {MdImage} from 'react-icons/md'

export default {
  name: 'imageAlt',
  title: 'Image',
  icon: MdImage,
  type: 'image',
  options: {
    metadata: [
      'blurhash',   // Default: included
      'lqip',       // Default: included
      'palette',    // Default: included
      'image',      // Default: not included
      'exif',       // Default: not included
      'location',   // Default: not included
    ],
  },
  fields: [
    {
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
      description: 'Users with visual impairments will read this description instead of the image.',
      validation: (Rule) => Rule.required().error('Alternative text is required'),
    },

  ],
}
