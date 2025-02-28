import createPage from '../../utils/createPage'

export default createPage({
  title: 'Home',
  slug: false,
  seo: true,
  slices: true,
  name: 'home',
  fields: [
    {
      name: 'form',
      type: 'array',
      of: [
        {
          type: 'textInput',
          name: 'textInput',
        },
        {
          type: 'textarea',
          name: 'textarea',
        },
        {
          type: 'selectInput',
          name: 'selectInput',
        },
      ],
    },
  ],
})
