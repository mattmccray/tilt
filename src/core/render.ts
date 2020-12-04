import markdownToHtml from "../helpers/markdownToHtml.js";
import { _pushContextStack, _popContextStack } from "./context.js";

export const html = (strings: TemplateStringsArray, ...values: any[]) => {
  let out = "";
  strings.forEach((string, i) => {
    const value = values[i];
    const type = Array.isArray(value) ? 'array' : typeof value
    const isDate = value instanceof Date
    const isNullish = !value

    if (type === "array") {
      out += string + value.join("")
    }
    else if (type === "string") {
      out += string + value
    }
    else if (type === "number") {
      out += string + String(value)
    }
    else if (type === "object" && !isNullish) {
      out += string + (isDate ? value.toUTCString() : value)
      console.warn("Templating warning: failed to coerce an object in your template.", value)
    }
    else { // undefined, null, boolean
      out += string
    }
  })

  return out;
};

export const js = html
export const text = html
export const css = html
export const xml = html

export const md = (strings: TemplateStringsArray, ...values: any[]) => {
  return markdownToHtml(html(strings, ...values))
}

export default html
