import MarkdownIt from 'markdown-it'
import mark from 'markdown-it-mark'
import tasklists from 'markdown-it-task-lists'
import container from 'markdown-it-container'
import footnote from 'markdown-it-footnote'
import highlight from 'markdown-it-highlightjs'

var md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  quotes: '“”‘’',
});

md.use(highlight, {
  register: {
    fountain: (hljs: any) => {
      return () => { }
    }
  }
})
md.use(mark)
md.use(tasklists)
md.use(footnote)
md.use(container, 'test')
md.use(container, 'full-width')
md.use(container, 'info')
md.use(container, 'note')
md.use(container, 'warning')
md.use(container, 'left')
md.use(container, 'right')
md.use(container, 'centered')
md.use(container, 'definition')
md.use(container, 'spoilers')
md.use(container, 'verbatim')
md.use(container, 'quote')
md.use(container, 'attribution')



md.renderer.rules.footnote_caption = function render_footnote_caption(tokens: any, idx: any/*, options, env, slf*/) {
  var n = Number(tokens[idx].meta.id + 1).toString();

  if (tokens[idx].meta.subId > 0) {
    n += ':' + tokens[idx].meta.subId;
  }

  // return '(' + n + ')';
  return n;
}

export function markdownToHtml(content = "") {
  return md.render(content)
}

export default markdownToHtml