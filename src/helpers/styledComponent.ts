import _ from "lodash";
import html, { css } from "../core/render.js";
import registerContent from "../core/registry.js";

interface StyledComponent {
  (props?: { className?: string }, children?: string): string,
  className: string
}

interface StyledComponentBuilder {
  (tag: string, styles: string | ((cls: string) => string)): StyledComponent;
  [tag: string]: (strings: TemplateStringsArray, ...values: any[]) => StyledComponent
}

function styled_(tag: string, styles: string | ((cls: string) => string)): StyledComponent {
  const style_id = _.uniqueId(tag + '_')
  const css = (typeof styles === 'function')
    ? styles(`.${style_id}`)
    : `.${style_id} { ${styles} }`

  registerContent.stylesheet(css)

  const Component = (props?: { className?: string }, children?: any) => {
    const className = (!!props && 'className' in props) ? props.className : ''
    return html`<${tag} class="${style_id} ${className}">${children}</${tag}>`
  }
  Component.className = style_id

  return Component
}

export const styled: StyledComponentBuilder = new Proxy(styled_, {
  get(target, tag, rec) {
    return (strings: TemplateStringsArray, ...values: any[]) => styled_(String(tag), css(strings, ...values))
  }
}) as StyledComponentBuilder


export default styled


// const Test = styled.div`
//   color: red;
// `

// const T2 = styled('button', css`
//   color: blue;
// `)

// const T3 = styled('button', cls => css`
//   .${cls} {
//     color: green;
//   }
//   .${cls}:hover {
//     color: yellow;
//   }
// `)