export { getContext } from './lib/context'
export { Content, ContentDatabase } from './lib/database'
export { onGenerate, onAfterGenerate, onBeforeGenerate } from './lib/lifecycle'
export { markdownToHTML } from './lib/markdown'
export { DefaultHtmlPage, DefaultLayout, forwardProps, RedirectPage, renderContent } from './lib/render'
export { classes, css, getGeneratedCss, styles } from './lib/styles'
export { getContentUri, getFilesInDirectoryRecursivelySync, normalizeHeadingLevels } from './lib/utils'

export interface Config {
  tilt: {
    source: string
    output: string
    markdown?: {
      containers?: string[]
    }
  }
  // Whatever you want to pass around
  [key: string]: any
}

let _activeConfiguration: Config | null = null

export function getActiveConfiguration(): Config | null {
  return _activeConfiguration
}

export function configure<T extends Config>(config: T): T {
  _activeConfiguration = config
  return config
}