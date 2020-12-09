import MarkdownIt from 'markdown-it'
import mark from 'markdown-it-mark'
import tasklists from 'markdown-it-task-lists'
import container from 'markdown-it-container'
import footnote from 'markdown-it-footnote'
import highlight from 'markdown-it-highlightjs'
import deflist from 'markdown-it-deflist'
import abbr from 'markdown-it-abbr'
import emoji from 'markdown-it-emoji'
import sub from 'markdown-it-sub'
import sup from 'markdown-it-sup'
import ins from 'markdown-it-ins'


var md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  quotes: '“”‘’',
});

md.use(highlight, {
  inline: true,
  register: {
    fountain: (hljs: any) => {
      return () => { }
    }
  }
})

md.use(mark)
md.use(tasklists)
md.use(footnote)
md.use(deflist)
md.use(abbr)
md.use(emoji)
md.use(sub)
md.use(sup)
md.use(ins)

export function configureMarkdownContainers(containers: string[]) {
  containers.forEach(name => md.use(container, name))
}

md.renderer.rules.footnote_caption = function render_footnote_caption(tokens: any, idx: any/*, options, env, slf*/) {
  var n = Number(tokens[idx].meta.id + 1).toString();

  if (tokens[idx].meta.subId > 0) {
    n += ':' + tokens[idx].meta.subId;
  }

  return n;
}

export function markdownToHtml(content = "") {
  return md.render(content)
}

export default markdownToHtml