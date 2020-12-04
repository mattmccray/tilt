import _ from "lodash";
import html, { css } from "../core/render.js";
import registerContent from "../core/registry.js";

interface StyledComponent {
  (props?: { className?: string }, children?: string): string,
  className: string
  componentName: string
}

interface StyledComponentBuilder {
  (name: string, tag: string, styles: string | ((cls: string) => string)): StyledComponent;
  [tag: string]: (strings: TemplateStringsArray, ...values: any[]) => StyledComponent
}

function styled_(name: string, tag: string, styles: string | ((cls: string) => string)): StyledComponent {
  const innerCls = generateClassName(name, tag) //_.uniqueId(name + '_')
  const clsName = name === tag ? innerCls : `${name} ${innerCls}`
  const css = (typeof styles === 'function')
    ? styles(`.${innerCls}`)
    : `.${innerCls} { ${styles} }`

  registerContent.stylesheet(css)

  const Component = function (props?: { className?: string }, children?: any) {
    const className = (!!props && 'className' in props) ? props.className : ''
    return html`<${tag} class="${clsName} ${className}">${children}</${tag}>`
  }
  Component.componentName = name || 'Anonymous'
  Component.className = innerCls

  return Component
}

export const styled: StyledComponentBuilder = new Proxy(styled_, {
  get(target, tag, rec) {
    return (strings: TemplateStringsArray, ...values: any[]) => styled_(String(tag), String(tag), css(strings, ...values))
  }
}) as StyledComponentBuilder


export default styled


let classCount = 177000 

function generateClassName(name?: string, tag?: string) {
  classCount += 1
  return '_' + classCount.toString(26) 
}

// const Test = styled.div`
//   color: red;
// `
