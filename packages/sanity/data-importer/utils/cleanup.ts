import {WalkBuilder} from 'walkjs'

export const removeMarkupFromText = (text: string) => {
  return text.replace(/<[^>]*>?/gm, '')
}

export const cleanupExtraneousNodes = (documents: any[] | any) => {
  const extraneousFields = [
    'PATH',
    'FIELD_NAME',
    'DOC_TYPE',
    'MAINTAIN_ORDER',
    'FIELD_VALUE',
    'IS_WEAK',
    'OUTPUT_ARRAY',
    'RESOLVE',
  ]

  new WalkBuilder()
    .withGraphMode('graph')
    .withGlobalFilter((node) => {
      return extraneousFields.some((field) => node.val && node.val[field] !== undefined)
    })
    .withSimpleCallback(async (node) => {
      extraneousFields.forEach((field) => {
        if (node.val && node.val[field] !== undefined) {
          delete node.val[field]
        }
      })
    })
    .walk(documents)
}
