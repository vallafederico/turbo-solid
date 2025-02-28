import {ShortcodeHandler} from './fields'

export const handleShortcodes = (shortcodes: ShortcodeHandler, data: string) => {
  let modifiedData = data

  Object.entries(shortcodes).map(([key, matcher]) => {
    if (!matcher.toString().endsWith('g') && !matcher.toString().endsWith('gm')) {
      throw new Error(
        `Shortcode ${key} is missing the global flag. Please add g or gm to the end of the regex.`,
      )
    }

    const matchedData = [...modifiedData.matchAll(matcher)]

    matchedData.forEach((match) => {
      const [fullMatch] = match
      const elementString = `<figure data-shortcode="${key}">$&</figure>`

      modifiedData = modifiedData.replace(fullMatch, elementString)
    })
  })

  return modifiedData
}
