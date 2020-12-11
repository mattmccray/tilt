import html, { css } from "../core/render.js";
import { registerClient } from "../core/registry.js";
import objectToAttributes from "./objectToAttributes.js";

export interface StyledComponent {
  (props?: { className?: string, [extra: string]: any }, children?: string): string,
  className: string
  tagName: string
  extend: (strings: TemplateStringsArray, ...values: any[]) => StyledComponent
}

interface StyledComponentBuilder {
  (tag: string, styles: string): StyledComponent;
  [tag: string]: (strings: TemplateStringsArray, ...values: any[]) => StyledComponent
}

function styledComponent(tag: string, styles: string): StyledComponent {
  const clsName = generateClassName()
  registerClient.stylesheet(expandParentSelectors(clsName, styles))
  return createComponent(tag, clsName)
}

export const styled: StyledComponentBuilder = new Proxy(styledComponent, {
  get(target: any, tag: string | number, rec: any) {
    return (strings: TemplateStringsArray, ...values: any[]) =>
      styledComponent(String(tag), css(strings, ...values))
  }
}) as StyledComponentBuilder

export default styled


function extendStyledComponent(Component: StyledComponent, strings: TemplateStringsArray, values: any[]): StyledComponent {
  const clsName = generateClassName()
  let inner_css = expandParentSelectors(clsName + '.' + Component.className, css(strings, values))
  registerClient.stylesheet(inner_css)
  return createNestedComponent(clsName, Component)
}

function createComponent(tag: string, clsName: string): StyledComponent {
  const Component: StyledComponent = ({ className = '', ...props } = {}, children?) => {
    return html`<${tag} class="${className} ${clsName}" ${objectToAttributes(props)}>${children}</${tag}>`
  }
  Component.className = clsName
  Component.tagName = tag
  Component.extend = extendStyledComponent.bind(null, Component)
  return Component
}

function createNestedComponent(clsName: string, Component: StyledComponent): StyledComponent {
  const WrappedComponent: StyledComponent = ({ className = '', ...props } = {}, children?) => {
    return Component({ ...props, className: `${className} ${clsName}` }, children)
  }
  WrappedComponent.className = clsName
  WrappedComponent.tagName = Component.tagName || 'div'
  WrappedComponent.extend = extendStyledComponent.bind(null, WrappedComponent)
  return WrappedComponent
}

function expandParentSelectors(className: string, styles: string) {
  let main: string[] = [`.${className} {`]
  let nested: string[] = []
  let collectingNested = false

  styles.split('\n').forEach(line => {
    if (!collectingNested) {
      if (line.includes('&')) {
        collectingNested = true
        main.push("}")
      }
      else {
        main.push(line)
      }
    }

    if (collectingNested) {
      nested.push(line.replace(/\&/g, `.${className}`))
    }
  })

  let output = [...main, ...nested].join('\n')

  if (output.split(/\{/).length > output.split(/\}/).length) {
    output += '}'
  }

  return output
}

let _classNameSeed = 177000

function generateClassName() {
  _classNameSeed += 1
  return '_' + _classNameSeed.toString(26)
}
