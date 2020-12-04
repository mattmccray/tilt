import { CollectionPage, Fileset, GeneratedFilePaths, Page, Site } from "./types.js"
import { getContext, setContext } from "./context.js"
import { Taxonomy } from "./taxonomies.js"

export function useSite(): Site {
  return getContext('site')
}
useSite.set = (val: Site) => setContext('site', val)

export function useFiles(): Fileset {
  return getContext('files')
}
useFiles.set = (val: Fileset) => setContext('files', val)

export function usePage(): Page {
  return getContext('page')
}
usePage.set = (val: Page) => setContext('page', val)

export function useCollection(name: string): CollectionPage[] { // REturn CollectionPage[]
  return getContext(`${name}Collection`)
}
useCollection.set = (name: string, val: Page[]) => setContext(`${name}Collection`, val)

export function useTaxonomy(): Taxonomy {
  return getContext('taxonomy')
}
useTaxonomy.set = (val: Taxonomy) => setContext('taxonomy', val)

export function useGeneratedFilePaths(): GeneratedFilePaths {
  return getContext('generatedFilePaths')
}
useGeneratedFilePaths.set = (val: GeneratedFilePaths) => setContext('generatedFilePaths', val)

