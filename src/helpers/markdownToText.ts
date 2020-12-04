import removeMd from 'remove-markdown'

/**
 * Removes markdown elements from text.
 */
export function markdownToText(content = '') {
  return removeMd(content, { gfm: true, stripListLeaders: true })
}

export default markdownToText