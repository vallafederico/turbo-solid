import {MdArticle} from 'react-icons/md'
import createPage from '../../utils/createPage'

export default createPage({
  name: 'article',
  icon: MdArticle,
  title: 'Article',
  prefix: 'article',
  slices: false,
  body: true,
})
