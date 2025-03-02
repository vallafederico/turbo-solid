import {setupPages} from '../utils/structure-utils'
import type {StructureBuilder, StructureResolver, StructureResolverContext} from 'sanity/structure'
import {MdArticle, MdHome, MdPages, MdPerson2, MdSearch, MdSettings} from 'react-icons/md'
import {RiLayoutTop2Line, RiLayoutBottom2Line, RiLayoutMasonryFill} from 'react-icons/ri'
import {AiOutlineFileSearch} from 'react-icons/ai'
import {IoShareSocial} from 'react-icons/io5'

export const structure: StructureResolver = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const {singlePage, pageList, folder, div} = setupPages(S)

  return S.list()
    .title('Studio')
    .items([
      singlePage('Home', 'home', MdHome),
      div(),
      singlePage('About', 'about', MdPerson2),
      pageList('Articles', 'article', MdArticle),
      div(),
      pageList('Pages', 'page', MdPages),
      pageList('Socials', 'socials', IoShareSocial),
      div(),
      folder('Global Layout', RiLayoutMasonryFill, [
        singlePage('Header', 'settings.header', RiLayoutTop2Line),
        singlePage('Footer', 'settings.footer', RiLayoutBottom2Line),
      ]),
      singlePage('Global SEO', 'seo', AiOutlineFileSearch),
      div(),
      folder('Settings', MdSettings, []),
    ])
}
