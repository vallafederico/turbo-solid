import {HiDocumentText} from 'react-icons/hi'
import type {IconType} from 'react-icons/lib'
import type {StructureBuilder} from 'sanity/structure'

export function setupPages(S: StructureBuilder) {
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

  return {singlePage, pageList, folder, div}
}
