import {
  MdAirportShuttle,
  MdArticle,
  MdError,
  MdHome,
  MdLocalAirport,
  MdPages,
  MdPeople,
  MdSearch,
  MdSettings,
} from 'react-icons/md'
import {HiDocumentText} from 'react-icons/hi'
import type {IconType} from 'react-icons/lib'
import {IoMdAirplane} from 'react-icons/io'
import type {StructureBuilder, StructureContext} from 'sanity/structure'
import {TbBuildingAirport} from 'react-icons/tb'
import {RiLayoutTop2Line, RiLayoutBottom2Line} from 'react-icons/ri'
export const structure = (S: StructureBuilder, context: StructureContext) => {
  const pageList = (title: string, schema: string, icon?: IconType) => {
    return S.listItem()
      .title(title)
      .icon(icon || HiDocumentText)
      .child(S.documentTypeList(schema))
  }

  const folder = (title: string, icon: IconType, items: any[]) => {
    return S.listItem().title(title).icon(icon).child(S.list().title(title).items(items))
  }

  const div = () => {
    return S.divider()
  }

  const singlePage = (title: string, schema: string, icon: IconType, docId?: string) => {
    return S.listItem()
      .title(title)
      .icon(icon || HiDocumentText)
      .child(S.editor().schemaType(schema).documentId(schema.replace(/\s/g, '-').toLowerCase()))
  }

  return S.list()
    .title('Content')
    .items([
      // folder('Pages', MdPages, [
      singlePage('Home', 'home', MdHome),
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
