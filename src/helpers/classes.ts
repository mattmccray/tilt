/**
 * Creates a className string based on all strings and objects passed. For objects
 * each property will be tested, if true then the property name will be added to
 * the class list returned.
 *
 * @param {...string|Object} params - List of strings or objects
 * @returns {string}
 */
export function classes(...params: any[]) {
  var results = "", item, key, i, l

  for (i = 0, l = arguments.length; i < l; i++) {
    item = arguments[i]
    if (!item) continue

    if (typeof item === 'string') {
      // results += ' '+ item
      results += item + ' '
    }
    else {
      for (key in item) {
        if (item[key]) { // If it's 'truthy'
          results += key + ' '
        }
      }
    }
  }

  return results.trim()
}

export default classes