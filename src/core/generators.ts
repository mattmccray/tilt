import { newFile, removeFile } from "../helpers/fileset.js";
import { normalizePageData } from "../plugins/normalizePages.js";
import { inNestedContext } from "./context.js";
import { usePage } from "./hooks.js";
import { Fileset, Page, PageGenerator } from "./types.js";

export function createGenerator(fileset: Fileset): PageGenerator {
  return (filepath: string, renderer: (newPage?: Page) => string) => {
    const page = newFile(fileset, filepath, {
      filepath, contents: ''
    })
    inNestedContext(() => {
      usePage.set(page)
      try {
        page.contents = renderer(page)
      }
      catch (err) {
        console.warn(`Error rendering generated page: "${filepath}"`)
        removeFile(fileset, filepath)
      }
      normalizePageData(page)
    })
    return page
  }
}

export function isGeneratorPage(sourcePage: any) {
  return !!sourcePage && sourcePage['generator'] === true
}