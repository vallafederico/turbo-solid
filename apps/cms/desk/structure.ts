import {setupPages} from '../utils/structure-utils'
import type {StructureBuilder, StructureResolver, StructureResolverContext} from 'sanity/structure'
import {MdArticle, MdHome, MdPages, MdSearch, MdSettings} from 'react-icons/md'
import {RiLayoutTop2Line, RiLayoutBottom2Line} from 'react-icons/ri'

export const structure: StructureResolver = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const {singlePage, pageList, folder, div} = setupPages(S)

  return S.list()
    .title('Studio')
    .items([
      // folder('Pages', MdPages, [
      singlePage('Home', 'home', MdHome),
      singlePage('About', 'about', MdHome),
      pageList('Pages', 'page', MdPages),
      pageList('Articles', 'article', MdArticle),
      div(),
      singlePage('SEO', 'settings.seo', MdSearch),

      folder('Global Layout', MdSettings, [
        singlePage('Header', 'settings.header', RiLayoutTop2Line),
        singlePage('Footer', 'settings.footer', RiLayoutBottom2Line),
      ]),
    ])
}
