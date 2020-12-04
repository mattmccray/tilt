import getHash from "../helpers/getHash.js"

export const CONTENT_TYPE_CSS = 'css'
export const CONTENT_TYPE_JS = 'js'

const _contentTypes = new Map<string, Map<string, string>>()

function setContentType(type: string, content: string) {
  if (!_contentTypes.has(type)) {
    _contentTypes.set(type, new Map<string, string>())
  }
  if (!content) {
    console.log("Invalid content!", content)
    return
  }
  const reg = _contentTypes.get(type)!
  const hash = getHash(content)
  reg.set(hash, content)
}

function getContentType(type: string) {
  const reg = _contentTypes.get(type)
  if (!reg) return ''


  let out = ''
  reg.forEach((content: string, key: string) => {
    out += `${content}\n\n`
  })

  return out
}

function clearContentType(type: string) {
  const reg = _contentTypes.get(type)
  if (!reg) return
  reg.clear()
}


function stylesheet(css: string) {
  setContentType(CONTENT_TYPE_CSS, css)
}

function javascript(js: string) {
  setContentType(CONTENT_TYPE_JS, stripScriptTag(js))
}

function fn(fn: Function) {
  setContentType(CONTENT_TYPE_JS, fn.toString())
}

function variable(name: string, value: any) {
  setContentType(CONTENT_TYPE_JS, `var ${name.trim()} = ${JSON.stringify(value)};`)
}



export const registerClient = {
  function: fn,
  stylesheet,
  javascript,
  variable,
}
export const registry = {
  getContentType,
  setContentType,
  clearContentType,
}

export default registry

// export 
function stripScriptTag(content: string) {
  if (typeof content == 'string') {
    content = content.trim()
    if (content.startsWith('<script')) {
      content = content.replace('<script>', '').replace('</script>', '')
    }
  }
  return content
}