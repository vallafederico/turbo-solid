export default {
  name: 'blockContent',
  title: 'Content',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading', value: 'h2'},
        {title: 'Subhead', value: 'h3'},
        {title: 'Microhead', value: 'h4'},
      ],
      lists: [
        {title: 'Bullets', value: 'bullet'},
        {title: 'Numbers', value: 'number'},
      ],
      marks: {
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',

            fields: [
              {
                name: 'url',
                type: 'string',
              },
              {
                name: 'noFollow',
                title: 'No Follow',
                type: 'boolean',
              },
            ],
          },
        ],
        decorators: [
          {
            title: 'Italics',
            value: 'em',
          },
          {
            title: 'Bold',
            value: 'strong',
          },
        ],
      },
    },
  ],
}
