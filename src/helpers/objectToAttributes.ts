
export function objectToAttributes(source: any) {
  let attrs = ''
  Object.keys(source || {}).forEach(name => {
    // FIXME: escape quotes?
    attrs += `${name}="${String(source[name])}"  `
  })
  return attrs
}

export default objectToAttributes