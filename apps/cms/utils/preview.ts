export const createPreview = (
  titleFieldName: string,
  subtitleFieldName?: string | null,
  mediaFieldName?: string | Function,
) => {
  // These can be undefined so this is fine
  const selectors = {}

  const extras = {}

  if (titleFieldName) {
    selectors.title = titleFieldName.toString()
  }

  if (titleFieldName.startsWith('{') && titleFieldName.endsWith('}')) {
    extras.title = titleFieldName.slice(1, -1)
    delete selectors.title
  }

  if (subtitleFieldName) {
    selectors.subtitle = subtitleFieldName.toString()
  }

  if (subtitleFieldName?.startsWith('{') && subtitleFieldName.endsWith('}')) {
    extras.subtitle = subtitleFieldName.slice(1, -1)
    delete selectors.subtitle
  }

  // Media cant be undefined, so only add it to object if its defined
  if (mediaFieldName) {
    if (typeof mediaFieldName === 'string') {
      selectors.media = mediaFieldName
    } else if (mediaFieldName instanceof Function) {
      extras.icon = mediaFieldName
      // selectors.media = mediaFieldName()
    }
  }

  const preview = {
    select: selectors,
    prepare(previewParts: object) {
      return {
        ...previewParts,
        ...extras,
      }
    },
  }
  return preview
}
