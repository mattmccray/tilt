import * as fs from 'fs'
import * as path from 'path'
import { Header, extractHeaders, markdownToHTMLAndExtractMetadata } from './markdown'
import { renderContent } from "./render"
import { getFilesInDirectoryRecursivelySync, countWordsInText, getContentUri, ensure } from "./utils"

export class ContentDatabase {
  static EXCLUDE_FILES = ['.DS_Store', 'Thumb.db']
  protected collectionMap = new Map<string, Content[]>()

  get collections() {
    return Array.from(this.collectionMap.keys())
  }

  constructor(public rootDirectory: string, protected excludeFiles: string[] = ContentDatabase.EXCLUDE_FILES) {
    this.scan()
  }

  get(collection: string, sort: 'date' | 'slug' = 'slug') {
    if (!this.collectionMap.has(collection)) throw new Error(`Collection ${collection} does not exist.`)
    const collectionList = this.collectionMap.get(collection) ?? []
    // TODO: Don't hardcode 'date' as the name of the date field
    if (sort === 'date') {
      collectionList.sort((a, b) => {
        if (a.data.date && b.data.date) return b.data.date.getTime() - a.data.date.getTime()
        if (a.data.date) return -1
        if (b.data.date) return 1
        return 0
      })
    } else {
      collectionList.sort((a, b) => a.slug.localeCompare(b.slug))
    }
    // TODO: Support sorting by other fields
    return collectionList
  }

  itemBySlug(collection: string, slug: string) {
    const content = this.get(collection).find((content) => content.slug === slug) ?? null
    if (!content) throw new Error(`Content ${collection}/${slug} does not exist.`)
    return content
  }

  select(collection: string, filterFn: (content: Content) => boolean): Content[] {
    return this.get(collection).filter(filterFn)
  }

  scan() {
    this.collectionMap.clear()
    const filelist = getFilesInDirectoryRecursivelySync(this.rootDirectory, this.excludeFiles)
    const grouped = this.groupByDirectory(filelist)

    Object.entries(grouped).forEach(([path, files]) => {
      if (!files.includes('index.md')) throw new Error(`Collection ${path} does not have an index.md file.`)
      const attachments = files.filter((file) => file !== 'index.md')
      const content = new Content(path, attachments, this)
      if (!this.collectionMap.has(content.collection)) this.collectionMap.set(content.collection, [])
      this.collectionMap.get(content.collection)?.push(content)
    })
  }

  protected groupByDirectory(files: string[]) {
    return files.reduce((acc, filePath) => {
      const fileDirectory = path.dirname(filePath)
      const fileName = path.basename(filePath)
      if (!acc[fileDirectory]) acc[fileDirectory] = []
      acc[fileDirectory].push(fileName)
      return acc
    }, {} as Record<string, string[]>)
  }
}


export class Content {
  collection: string
  slug: string
  data: Record<string, any> = {}
  html!: string
  htmlSourceOnly!: string
  source!: string
  // Extracted Table of Contents
  toc!: Header[]
  wordCount!: number

  constructor(public path: string, public attachments: string[], public db: ContentDatabase) {
    const { collection, slug } = this.parseFilepath(path)
    this.collection = collection
    this.slug = slug
    this.readSource()
    // console.log(`${collection}/${slug}:`, this)
  }

  has(key: string) {
    return this.data.hasOwnProperty(key) || this.hasOwnProperty(key)
  }

  get(key: string, defaultValue: any = null) {
    return this.data[key] ?? (this as any)[key] ?? defaultValue
  }

  getUri(attachment?: string) {
    if (attachment) ensure(this.attachments.includes(attachment), `Attachment ${attachment} does not exist for ${this.collection}/${this.slug}.`)
    return getContentUri(this, attachment)
  }

  protected render(layout?: any) {
    // This will render the html string and populate the html string
    const html = renderContent(this, layout)
    this.html = html
  }

  protected parseFilepath(filepath: string) {
    const relativePath = path.relative(this.db.rootDirectory, filepath)
    const [collection, slug] = relativePath.split('/')
    return { collection, slug }
  }

  protected readSource() {
    // This will load the source file and populate the data object and html string and source string
    const filedata = fs.readFileSync(path.join(this.path, 'index.md'), 'utf-8')
    const { html, metadata } = markdownToHTMLAndExtractMetadata(filedata)

    this.source = String(filedata)
    this.data = metadata

    // TODO: Make this autoMemo getters so they aren't pre-calced, but only calculated when needed
    this.html = html
    this.htmlSourceOnly = html
    this.toc = extractHeaders(html)
    this.wordCount = countWordsInText(this.source)
  }

  static render(content: Content, layout?: any) {
    return content.render(layout)
  }
}