import {setupPages} from '../utils/structure-utils'
import type {StructureBuilder, StructureResolver, StructureResolverContext} from 'sanity/structure'
import {MdArticle, MdHome, MdPages, MdSearch, MdSettings} from 'react-icons/md'
import {RiLayoutTop2Line, RiLayoutBottom2Line} from 'react-icons/ri'
import {AiOutlineFileSearch} from 'react-icons/ai'
import { IoShareSocial } from 'react-icons/io5'

export const structure: StructureResolver = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  const {singlePage, pageList, folder, div} = setupPages(S)

  return S.list()
    .title('Studio')
    .items([
      singlePage('Home', 'home', MdHome),
      singlePage('About', 'about', MdHome),
      pageList('Articles', 'article', MdArticle),
      div(),
      pageList('Pages', 'page', MdPages),
      div(),
      pageList('Socials', 'socials', IoShareSocial),
      div(),
      singlePage('Global SEO', 'seo', AiOutlineFileSearch),
      folder('Global Layout', MdSettings, [
        singlePage('Header', 'settings.header', RiLayoutTop2Line),
        singlePage('Footer', 'settings.footer', RiLayoutBottom2Line),
      ]),
      folder('Settings', MdSettings, []),
    ])
}
