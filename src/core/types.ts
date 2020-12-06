import Metalsmith from "metalsmith";
import { Stats } from "fs";
import Tilt from './tilt.js';

export type TiltEngine = Metalsmith

export type Plugin = (files: Fileset, tilt: TiltEngine, callback: Callback) => void;

export type Callback = (err?: Error | null, files?: Fileset, tilt?: TiltEngine) => void;
export type Ignore = (path: string, stat: Stats) => void;

export type Component = (props?: any, children?: string) => string
export type LayoutComponent = (props: { site: Site, page: Page }, children?: string) => string

export interface Site {
  /** Provided at build time. */
  builtAt?: Date
  /** Provided at build time. */
  isDevelopment?: boolean
  url: string
}


export interface Page {
  // EVERY PAGE HAS AT LEAST THIS:
  filepath: string
  contents: Buffer | String

  // GENERATORS SET THIS:
  generator?: boolean

  // THESE ARE OPTIONAL, SOMETIMES SET BY PLUGINS
  originalPath?: string
  layout?: string


  title?: string
  subtitle?: string
  slug?: string
  link?: string
  permalink?: string
  description?: string
  date?: Date
  isoDate?: string
  year?: string
  tags?: { name: string, slug: string }[] // In the frontmatter it should be string[]
  categories?: { name: string, slug: string }[][] // In the frontmatter it should be string[][]
  cover?: string
  image?: string
  alias?: string[]
  draft?: boolean
  doNotRender?: boolean
  noIndex?: boolean

  stats?: {
    mtime: number
  }
  sceneBreak?: string

  // From cleanUrls plugin
  noCleanUrl?: boolean
  sourcePath?: string

  // Set by RenderMarkdown plugin...
  markdown?: string
  contentStats?: {
    wordCount: number,
    wordCountRounded: number,
    readingTimeValue: number,
    wholeMinutes: number,
    readingTime: string
  },
}


export interface CollectionPage extends Page {
  next?: CollectionPage
  hasNext?: boolean
  prev?: CollectionPage
  hasPrev?: boolean
}


export interface Fileset {
  [filename: string]: Page
}


export interface GeneratedFilePaths {
  css: string
  js: string
}