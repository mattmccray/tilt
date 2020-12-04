import removeHtml from 'html-to-text'

/**
 * Removes html elements from text.
 * 
 * @param {string} content 
 */
export function htmlToText(content: string) {
  return removeHtml.fromString(content, {
    ignoreHref: true,
    ignoreImage: true,
    unorderedListItemPrefix: ' '
  })
}

export default htmlToText