import _ from 'lodash'
import { Fileset, Page } from './types.js'


export class TagSet {
  name: string
  slug: string
  sortBy: string // Fieldname?
  pages: Page[] = []
  nested: Map<string, TagSet> = new Map()

  constructor({ name, slug, sortBy = 'date' }: { name: string, slug: string, sortBy?: string }) {
    this.name = name
    this.slug = slug
    this.sortBy = sortBy
  }

  toJSON() {
    return {
      name: this.name,
      slug: this.slug,
      pages: _.sortBy(this.pages, this.sortBy),
      pagesDesc: _.sortBy(this.pages, this.sortBy).reverse(),
    }
  }
}

export class Taxonomy {
  cataloguedPages: Page[] = []
  tags = new Map<string, TagSet>()
  categories = new Map<string, TagSet>()

  constructor(files: Fileset, private _hiddenField = 'hideInSiteMap') {
    this._generateIndex(files)
  }

  get tagList() {
    return _.sortBy(Array.from(this.tags.values()).map(tagset => tagset.toJSON()), 'pages.length').reverse()
  }

  get categoryList() {
    return this._categoryMapToArray(this.categories)
  }

  /**
   * @param {string} category Nested category names look like: "Books/Classic"
   * @param {boolean} [includeNested] (Not used yet)
   */
  getPagesForCategory(category: string, includeNested = false) {
    let parts = category.trim().split('/')
    let cat: Map<string, TagSet> | undefined = this.categories
    let catMap: TagSet | undefined

    while (parts.length > 0 && !!cat) {
      const part = parts.shift()!
      catMap = cat.get(part)
      cat = !!catMap
        ? catMap.nested
        : undefined
    }

    return catMap?.pages || []
  }

  /**
   * @param {string} tagName Use tag.name as the key
   */
  getPagesForTagName(tagName: string) {
    if (this.tags.has(tagName)) return this.tags.get(tagName)!.pages
    else return []
  }


  private _categoryMapToArray(catMap: Map<string, TagSet>, sortField = 'date'): CategoryList[] {
    return _.sortBy(Array.from(catMap.values()).map(tagset => ({
      name: tagset.name,
      slug: tagset.slug,
      pages: _.sortBy(tagset.pages, sortField),
      pagesDesc: _.sortBy(tagset.pages, sortField).reverse(),
      nested: this._categoryMapToArray(tagset.nested)
    })), ['name'])
  }


  _generateIndex(files: Fileset) {
    Object.keys(files).forEach(filename => {
      const page = files[filename]
      if ((page as any)[this._hiddenField] == true) return

      const hasTags = ('tags' in page && page.tags?.length)
      const hasCategories = ('categories' in page && page.categories?.length)

      if (hasTags) {
        page.tags?.forEach(tag => {
          if (!this.tags.has(tag.name)) {
            this.tags.set(tag.name, new TagSet(tag))
          }
          this.tags.get(tag.name)!.pages.push(page)
        })
      }

      if (hasCategories) {
        page.categories?.forEach(category => {
          let catMap: Map<string, TagSet> | undefined = this.categories
          let catSet: TagSet | undefined = undefined

          category.forEach(cat => {
            if (!catMap?.has(cat.name)) catMap?.set(cat.name, new TagSet(cat))
            catSet = catMap?.get(cat.name)
            catMap = catSet?.nested
          })

          //@ts-ignore
          if (!catSet.pages.includes(page)) catSet?.pages.push(page) // TODO: Fix this!
        })
      }

      if (hasTags || hasCategories) {
        this.cataloguedPages.push(page)
      }
    })
  }
}

interface CategoryList {
  name: string,
  slug: string
  pages: Page[]
  pagesDesc: Page[]
  nested: CategoryList[]
}