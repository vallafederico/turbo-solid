import {MdArticle} from 'react-icons/md'
import createPage from '../../utils/createPage'

export default createPage({
  name: 'article',
  icon: MdArticle,
  title: 'Article',
  slices: false,
  body: true,
  fields: [
    {
      name: 'link',
      title: 'Link',
      type: 'link',
    },
  ],
})
