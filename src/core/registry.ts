import getHash from "../helpers/getHash.js"

export const CONTENT_TYPE_CSS = 'css'
export const CONTENT_TYPE_JS = 'js'


// TODO: Change this to a ContentRegister
export class RegisteredContentController {
  private _type_registery = new Map<string, Map<string, string>>()


  setContentType(type: string, content: string) {
    if (!this._type_registery.has(type)) {
      this._type_registery.set(type, new Map<string, string>())
    }
    if (!content) {
      console.log("Invalid content!", content)
      return
    }
    const reg = this._type_registery.get(type)!
    const hash = getHash(content)
    reg.set(hash, content)
  }

  getContentType(type: string) {
    const reg = this._type_registery.get(type)
    if (!reg) return ''


    let out = ''
    reg.forEach((content: string, key: string) => {
      out += `${content}\n\n`
    })

    return out
  }

  clearContentType(type: string) {
    const reg = this._type_registery.get(type)
    if (!reg) return
    reg.clear()
  }

  stylesheet(css: string) {
    this.setContentType(CONTENT_TYPE_CSS, css)
  }

  javascript(js: string) {
    this.setContentType(CONTENT_TYPE_JS, stripScriptTag(js))
  }

  /**
   * Serializes a function to source code and adds to script content
   * @param {Function} fn 
   */
  function(fn: Function) {
    this.setContentType(CONTENT_TYPE_JS, fn.toString())
  }

  /**
   * 
   * @param {string} name 
   * @param {any} value 
   */
  variable(name: string, value: any) {
    this.setContentType(CONTENT_TYPE_JS, `var ${name.trim()} = ${JSON.stringify(value)};`)
  }

  // static get instance() {
  //   return registerContent
  // }
}


export const registerContent = new RegisteredContentController()

export default registerContent

export function stripScriptTag(content: string) {
  if (typeof content == 'string') {
    content = content.trim()
    if (content.startsWith('<script')) {
      content = content.replace('<script>', '').replace('</script>', '')
    }
  }
  return content
}