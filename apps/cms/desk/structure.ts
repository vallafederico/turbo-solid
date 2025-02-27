import {setupPages} from '../utils/structure-utils'
import type {StructureBuilder, StructureContext} from 'sanity/structure'

import {MdHome, MdPages, MdSearch, MdSettings} from 'react-icons/md'
import {RiLayoutTop2Line, RiLayoutBottom2Line} from 'react-icons/ri'

export const structure = (S: StructureBuilder, context: StructureContext) => {
  const {singlePage, pageList, folder, div} = setupPages(S)

  return S.list()
    .title('Content')
    .items([
      // folder('Pages', MdPages, [
      singlePage('Home', 'home', MdHome),
      singlePage('About', 'about', MdHome),
      pageList('Pages', 'page', MdPages),
      div(),
      singlePage('SEO', 'settings.seo', MdSearch),

      folder('Global Layout', MdSettings, [
        singlePage('Header', 'settings.header', RiLayoutTop2Line),
        singlePage('Footer', 'settings.footer', RiLayoutBottom2Line),
      ]),
    ])
}
