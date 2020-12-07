import _ from "lodash";
import html, { css } from "../core/render.js";
import { registerClient } from "../core/registry.js";

interface StyledComponent {
  (props?: { className?: string, [extra: string]: any }, children?: string): string,
  className: string
  componentName: string
}

interface CssBuilder {
  (cls: string): string
}

interface StyledComponentBuilder {
  (tag: string, styles: string | CssBuilder): StyledComponent;
  (name: string, tag: string, styles: string | CssBuilder): StyledComponent;
  [tag: string]: (strings: TemplateStringsArray, ...values: any[]) => StyledComponent
}

function styledComponent(name: string, tag: string | CssBuilder, styles?: string | CssBuilder): StyledComponent {
  if (typeof tag == 'function' || !styles) {
    styles = tag
    tag = name
  }
  const innerCls = generateClassName(name, tag) //_.uniqueId(name + '_')
  const clsName = name === tag ? innerCls : `${name} ${innerCls}`
  const css = (typeof styles === 'function')
    ? styles(`.${innerCls}`)
    : styles.includes('&')
      ? parseNestedCss(innerCls, styles)
      : `.${innerCls} { ${styles} }`

  registerClient.stylesheet(css)

  const Component = function (props?: { className?: string, [extra: string]: any }, children?: any) {
    const className = (!!props && 'className' in props) ? props.className : ''
    return html`<${tag} class="${clsName} ${className}" ${toAttrs(props)}>${children}</${tag}>`
  }
  Component.componentName = name || 'Anonymous'
  Component.className = innerCls

  return Component
}

export const styled: StyledComponentBuilder = new Proxy(styledComponent, {
  get(target, tag, rec) {
    return (strings: TemplateStringsArray, ...values: any[]) => styledComponent(String(tag), String(tag), css(strings, ...values))
  }
}) as StyledComponentBuilder

export function toAttrs(source: any) {
  let attrs = ''
  Object.keys(source || {}).forEach(name => {
    if (name === 'className') return
    attrs += `${name}="${String(source[name])}"  `
  })
  return attrs
}

export default styled


let classCount = 177000 

function generateClassName(name?: string, tag?: string) {
  classCount += 1
  return '_' + classCount.toString(26) 
}

// const Test = styled.div`
//   color: red;
// `


function parseNestedCss(cls: string, styles: string) {
  let compoundCss = ''
  let parent: string[] = [`.${cls} {`]
  let remainder: string[] = []

  let isCollectingRemainder = false

  styles.split('\n').forEach(line => {
    if (!isCollectingRemainder) {
      if (line.includes('&')) {
        isCollectingRemainder = true
        parent.push("}")
      }
      else {
        parent.push(line)
      }
    }

    if (isCollectingRemainder) {
      remainder.push(line.replace(/\&/g, `.${cls}`))
    }
  })


  compoundCss = [...parent, ...remainder].join('\n\n')

  // console.log("CompoundCSS:", { styles, compoundCss })

  return compoundCss
}