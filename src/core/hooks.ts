import { CollectionPage, Fileset, Page, Site } from "./types"
import { getContext, setContext } from "./context"

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

/**
 * @returns {import('./taxonomies.js').Taxonomy}
 */
export function useTaxonomy() {
  return getContext('taxonomy')
}
useTaxonomy.set = (val: any) => setContext('taxonomy', val) //TODO: Type as Taxonomy!

