/**
 * Converts a string to a URL-friendly slug
 * @param {string} text - The text to convert to a slug
 * @returns {string} The slugified text with spaces replaced by hyphens, non-word chars removed, and trimmed
 */
export const slugify = (text: string) => {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}
