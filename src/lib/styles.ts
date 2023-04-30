import { calcHash } from "./utils"

let _styles: string[] = []
let _namePrefix = 'tilt'
let _config = {
  debug: false,
  replaceRegExp: /&/g,
  hashIds: true,
}

export function css(template: TemplateStringsArray, ...params: any[]): string {
  const filename = _getFilename()
  const fromTemplate = extractClassName(template[0])
  const blockId = !fromTemplate && _config.hashIds
    ? calcHash(template.join('') + params.join('')).toString(36)
    : uid()
  const id = fromTemplate || `${_namePrefix}_${blockId}`
  const className = `.${id}`

  let styles = _config.debug ? `/* Source: ${filename} */\n` : ''

  for (let i = 0; i < params.length; i++) {
    styles += _substituteClassname(template[i], className)
    styles += String(params[i])
  }

  if (template.length > params.length) {
    styles += _substituteClassname(template[template.length - 1], className)
  }

  if (_config.debug) console.debug('CSS:', styles)

  _appendStyles(styles)

  return id
}

var classNameCommentRe = /\/\*(.*)\*\//

function extractClassName(template: string = '') {
  const first = template.trim().split("\n")[0]
  const [_, match] = first.match(classNameCommentRe) || []
  if (!!match) {
    return match.trim().replace(/\s/, '')
  }
  return null
}

export function classes(...extra: (string | Partial<Record<string, any>> | undefined | null)[]) {
  let className: string[] = []
  extra.forEach((item: any) => {
    if (!item) return
    else if (typeof item === 'string') className.push(item)
    else Object.keys(item).forEach((key) => {
      if (item[key]) className.push(key)
    })
  })
  return className.join(' ')
}

function classBuilder<T extends string>(id: string) {
  // let apply = (...extra: (T | Partial<Record<T, any>>)[]) => {
  let apply = (...extra: (string | Partial<Record<string, any>> | undefined | null)[]) => {
    return classes(...extra, id)
  }
  apply.toString = () => id
  return apply
}

export function styles(template: TemplateStringsArray, ...params: any[]): ReturnType<typeof classBuilder> {
  return classBuilder(css(template, ...params))
}


function _substituteClassname(source: string, className: string): string {
  return source.replace(_config.replaceRegExp, className)
}

// export 
function assignName(name: string, builder: () => string): string {
  const previousPrefix = _namePrefix
  _namePrefix = name
  const className = builder()
  _namePrefix = previousPrefix
  return className
}

function _appendStyles(style: string) {
  _styles.push(style)
}

export function getGeneratedCss(createHash: boolean = false) {
  const source = _styles.join('\n\n')
  const css = source // postcss([autoprefixer]).process(source).css
  const hash = createHash ? calcHash(css).toString(36) : ''

  return { css, hash }
}






// Only works well with Chromium browsers...
function _getFilename() {
  let stack = _getStack()
  let filename = 'unknown'
  try {
    // console.log('trace:', stack)
    let line = stack.split('\n')[5].trim()
    let parts = line.split('/')
    filename = parts[parts.length - 1]
    filename = filename.split("?")[0]
  }
  catch (ignore) { }
  return filename
}

function _getStack() {
  let stack = ''
  try {
    throw new Error('test')
  }
  catch (err: any) {
    stack = err.stack ?? ''
  }
  return stack
}


const _startingDate = new Date(2021, 0, 1).getTime()
let _prevUid = 0

/**
 * Unique ID - Date based
 */
export function uid(radix: number = 36): string {
  let now = Date.now() - _startingDate
  if (now <= _prevUid) now = _prevUid + 1
  _prevUid = now
  return _prevUid.toString(radix)
}