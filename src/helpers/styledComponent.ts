import html, { css } from "../core/render.js";
import { registerClient } from "../core/registry.js";

interface StyledComponent {
  (props?: { className?: string, [extra: string]: any }, children?: string): string,
  className: string
  componentName: string
  tagName: string
  extend: (strings: TemplateStringsArray, ...values: any[]) => StyledComponent
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
  const innerCls = generateClassName(name, tag)
  const clsName = name === tag ? innerCls : `${name} ${innerCls}`
  const css = (typeof styles === 'function')
    ? styles(`.${innerCls}`)
    : styles.includes('&')
      ? parseNestedCss(innerCls, styles)
      : `.${innerCls} { ${styles} }`

  registerClient.stylesheet(css)

  const Component: StyledComponent = (props?: { className?: string, [extra: string]: any }, children?: any) => {
    const className = (!!props && 'className' in props) ? props.className : ''
    return html`<${tag} class="${clsName} ${className}" ${toAttrs(props)}>${children}</${tag}>`
  }
  Component.componentName = name || 'Anonymous'
  Component.className = innerCls
  Component.tagName = tag
  Component.extend = extendStyledComponent.bind(null, Component)

  return Component
}

export const styled: StyledComponentBuilder = new Proxy(styledComponent, {
  get(target, tag, rec) {
    return (strings: TemplateStringsArray, ...values: any[]) =>
      styledComponent(String(tag), String(tag), css(strings, ...values))
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

function parseNestedCss(cls: string, styles: string) {
  let main: string[] = [`.${cls} {`]
  let nested: string[] = []
  let collectNested = false

  styles.split('\n').forEach(line => {
    if (!collectNested) {
      if (line.includes('&')) {
        collectNested = true
        main.push("}")
      }
      else {
        main.push(line)
      }
    }

    if (collectNested) {
      nested.push(line.replace(/\&/g, `.${cls}`))
    }
  })

  return [...main, ...nested].join('\n')
}

function extendStyledComponent(Component: StyledComponent, strings: TemplateStringsArray, values: any[]): StyledComponent {
  const id = generateClassName(Component.componentName, Component.tagName)
  const styles = css(strings, values)

  let inner_css = parseNestedCss(id + '.' + Component.className, styles)

  if (inner_css.split(/\{/).length > inner_css.split(/\}/).length) {
    inner_css += '}'
  }

  registerClient.stylesheet(inner_css)

  const WrappedComponent: StyledComponent = (props, children) => {
    const className = (!!props && 'className' in props) ? props.className : ''
    return Component({ ...props, className: id + ' ' + className }, children)
  }

  WrappedComponent.tagName = Component.tagName
  WrappedComponent.componentName = Component.componentName
  WrappedComponent.className = id
  WrappedComponent.extend = extendStyledComponent.bind(null, WrappedComponent)

  return WrappedComponent
}