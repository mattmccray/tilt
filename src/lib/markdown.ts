import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'

// import mark from 'markdown-it-mark'
// import tasklists from 'markdown-it-task-lists'
// import container from 'markdown-it-container'
// import footnote from 'markdown-it-footnote'
// import sub from 'markdown-it-sub'
// import sup from 'markdown-it-sup'
// import ins from 'markdown-it-ins'
const mark = require('markdown-it-mark')
const tasklists = require('markdown-it-task-lists')
const container = require('markdown-it-container')
const footnote = require('markdown-it-footnote')
const sub = require('markdown-it-sub')
const sup = require('markdown-it-sup')
const ins = require('markdown-it-ins')
const anchor = require('markdown-it-anchor')

// var hljs = require('highlight.js') // https://highlightjs.org

// // Actual default values
// var md = require('markdown-it')({
//   highlight: function (str, lang) {
//     if (lang && hljs.getLanguage(lang)) {
//       try {
//         return '<pre class="hljs"><code>' +
//           hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
//           '</code></pre>'
//       } catch (__) { }
//     }

//     return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
//   }
// });


var md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  quotes: '“”‘’',
})

// md.use(highlight, {
//   register: {
//     fountain: (hljs: any) => {
//       return () => { }
//     }
//   }
// })

md.use(mark)
md.use(tasklists)
md.use(footnote)
md.use(sub)
md.use(sup)
md.use(ins)
md.use(anchor, {})


export function useContainers(containers: string[]) {
  containers.forEach((name: any) => {
    md.use(container, name)
  })
}


md.renderer.rules.footnote_caption = function render_footnote_caption(tokens: any, idx: any/*, options, env, slf*/) {
  var n = Number(tokens[idx].meta.id + 1).toString()

  if (tokens[idx].meta.subId > 0) {
    n += ':' + tokens[idx].meta.subId
  }

  // return '(' + n + ')';
  return n
}

export function markdownToHTML(content = "", env: any = {}): string {
  // content = straightenFancyText(content)
  return md.render(content, {
    ...env,
  })
}
export default markdownToHTML

export function markdownToHTMLAndExtractMetadata(content = "", env: any = {}): { html: string, metadata: any } {
  // content = straightenFancyText(content)
  const { metadata, markdown } = extractMetadata(content, env)
  const html = markdownToHTML(markdown, metadata)
  return { html, metadata }
}

export function extractMetadata(content = "", env: any = {}): any {
  let markdown = content
  let excerpt = ""
  let metadata = {
    ...env,
  }
  try {
    const parsed = matter(content)
    excerpt = parsed.excerpt ?? ''
    markdown = parsed.content
    metadata = {
      ...metadata,
      ...parsed.data,
    }
  } catch (e) {
    var err = new Error(`Invalid frontmatter in content ${env.filepath ? `in ${env.filepath}` : ''}`)
    //@ts-ignore
    err.code = 'invalid_frontmatter'
    throw err
  }
  return { metadata, markdown, excerpt } as const
}

export type Header = {
  level: string
  id: string
  text: string
}

const headerScannerRE = /<h([1-6]{1}) id="(.*)">(.*)<\/h[1-6]{1}>/g
const headerExtractorRE = /<h(\d) id="(.*?)"(?:\s.*?)?>(.*?)<\/h\d>/

export function extractHeaders(html: string): Header[] {
  const headers = html.match(headerScannerRE)
  if (!headers) return []

  const headersItems = headers.map((item: string) => {
    const [_, level, id, text] = item.trim().match(headerExtractorRE)!
    return { level, id, text }
  })

  return headersItems
}

export function straightenFancyText(text: string) {
  // Replace fancy quotes with Markdown-friendly syntax
  text = text.replace(/[\u2018\u2019]/g, "'") // Replacing single quotes
  text = text.replace(/[\u201C\u201D]/g, "\"") // Replacing double quotes

  // Replace other advanced punctuation with Markdown-friendly syntax
  text = text.replace(/\u2013/g, "-") // Replacing en dash
  text = text.replace(/\u2014/g, "--") // Replacing em dash
  text = text.replace(/\u2026/g, "...") // Replacing ellipsis
  text = text.replace(/\u2010/g, "-") // Replacing hyphen
  text = text.replace(/\u2015/g, "--") // Replacing horizontal bar
  text = text.replace(/\u2212/g, "-") // Replacing minus sign
  text = text.replace(/\u00B0/g, "&#176;") // Replacing degree symbol

  return text
}

// function to remove \u00A0 from strings
export function removeNonBreakingSpaces(str: string) {
  return str.replace(/\u00A0/g, ' ')
}