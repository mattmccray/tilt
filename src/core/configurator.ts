import _ from 'lodash'
import Metalsmith from "metalsmith"
import { Layouts } from "../plugins/applyLayouts.js"
import { CollectionConfig } from "../plugins/createCollections.js"
import { useEnabledFeatures, useFiles, useGeneratedFilePaths, useSite } from "./hooks.js"
import Tilt from "./tilt.js"
import { Site, Plugin } from "./types.js"
import * as plugins from '../plugins.js'
import { MinifyOptions } from '../plugins/runMinify.js'

type BuildPhase
  = 'pre'
  | 'init'
  | 'generate'
  | 'render'
  | 'build'
  | 'post'
type StepPos = 'before' | 'after'
type BuildPhaseAndPos = `${StepPos}-${BuildPhase}`

interface BuildInfo {
  cwd: string
  source: string
  destination: string
  ignore?: []
  clean?: boolean
}

export interface EnabledFeatures {
  layouts?: Layouts
  generators?: any
  defaultMetadata?: any
  aliases?: any
  drafts?: {
    mode: 'purge' | 'mark'
    collections: string[]
  }
  cleanUrls?: any
  taxonomy?: any
  contentRegistry?: {
    css: string
    js: string
  }
  collections?: CollectionOptions
  staticFiles?: {
    [source: string]: string // destination
  }
  minify?: MinifyOptions

  [feature: string]: any
}

interface CollectionOption extends CollectionConfig {
  purgeDrafts?: boolean
}

interface CollectionOptions {

  [path: string]: CollectionOption
}

const BuildSequence: (BuildPhase | BuildPhaseAndPos)[] = [
  'before-pre', 'pre', 'after-pre',
  'before-init', 'init', 'after-init',
  'before-generate', 'generate', 'after-generate',
  'before-render', 'render', 'after-render',
  'before-build', 'build', 'after-build',
  'before-post', 'post', 'after-post',
]
const IGNORE_DEFAULTS = ["**/.DS_Store", "**/.git", "**/.git/**", "**/thumbs.db"]

export class TiltConfigurator {
  // protected plugins: Map<BuildStep, Plugin[]> = new Map()
  protected plugins = new PluginManager<BuildPhase | BuildPhaseAndPos>()
  protected buildInfo: BuildInfo | undefined
  protected siteInfo: Site = {} as any
  protected featureConfigs: EnabledFeatures = {}

  constructor(private _tilt: Tilt) {
    this.clearPlugins()
  }


  setBuildInfo(buildInfo: BuildInfo) {
    this.buildInfo = buildInfo
    return this
  }

  setSiteInfo(siteInfo: Site) {
    this.siteInfo = siteInfo
    return this
  }

  applyDefaultMetadata(options: any) {
    this.featureConfigs.defaultMetadata = options
    return this
  }

  copyStaticFiles(pathConfig: EnabledFeatures['staticFiles']) {
    this.featureConfigs.staticFiles = pathConfig
    return this
  }

  enableLayouts(layouts: Layouts) {
    this.featureConfigs.layouts = layouts
    return this
  }

  enableGenerators() {
    this.featureConfigs.generators = {}
    return this
  }

  enableAliases() {
    this.featureConfigs.aliases = {}
    return this
  }

  enableCleanUrls() {
    this.featureConfigs.cleanUrls = {}
    return this
  }

  enableMinify(options: MinifyOptions) {
    this.featureConfigs.minify = options
    return this
  }

  enableTaxonomy() {
    this.featureConfigs.taxonomy = {}
    return this
  }

  enableContentRegistry(extractionPaths: EnabledFeatures['contentRegistry']) {
    this.featureConfigs.contentRegistry = extractionPaths
    return this
  }

  enableCollections(collectionOptions: EnabledFeatures['collections']) {
    this.featureConfigs.collections = collectionOptions
    return this
  }

  enableDrafts(draftOptions: EnabledFeatures['drafts']) {
    this.featureConfigs.drafts = draftOptions
    return this
  }

  usePlugin(fn: Plugin, buildStep: BuildPhaseAndPos) {
    this.plugins.add(fn, buildStep)
    return this
  }

  clearPlugins() {
    this.plugins.clear()
    return this
  }

  protected getPlugins() {
    return this.plugins.toArray(BuildSequence)
  }

  static finalize(tilt: Tilt, config: TiltConfigurator) {
    if (!config.buildInfo) throw new Error("Invalid configuration: Missing build info.")

    const { cwd, source, destination, clean = false, ignore = IGNORE_DEFAULTS } = config.buildInfo

    const metalsmith = Metalsmith(cwd)
    const features = config.featureConfigs

    useEnabledFeatures.set(features)

    metalsmith.metadata({
      ...config.siteInfo,
      isDevelopment: process.env.NODE_ENV !== "production",
      builtAt: new Date(),
    })

    metalsmith
      .source(source)
      .destination(destination)
      .clean(clean)
      .ignore(ignore)

    metalsmith.use((files, tilt, done) => {
      Object.keys(files).forEach(originalPath => {
        files[originalPath].originalPath = originalPath
        files[originalPath].filepath = originalPath
      })

      useSite.set(tilt.metadata() as any)
      useFiles.set(files)

      done(null, files, tilt)
    })

    config.plugins.add(plugins.normalizePages(), 'pre')
    config.plugins.add(plugins.extractFrontmatter({}), 'pre')
    config.plugins.add(plugins.extractExcerpts({}), 'pre')
    config.plugins.add(plugins.removeFlagged({}), 'pre')
    config.plugins.add(plugins.renderMarkdown({}), 'render')
    config.plugins.add(plugins.renderTiltTemplates({}), 'render')


    if (!!features.aliases) {
      config.plugins.add(plugins.handleAliases(), 'post')
    }

    if (!!features.cleanUrls) {
      config.plugins.add(plugins.cleanUrls(), 'init')
    }

    if (!!features.collections) {
      config.plugins.add(plugins.createCollections(features.collections), 'generate')
    }

    if (!!features.drafts) {
      config.plugins.add(plugins.handleDrafts({
        paths: features.drafts.collections,
        markOnly: features.drafts.mode === 'mark'
      }), 'generate')
    }

    if (!!features.contentRegistry) {
      useGeneratedFilePaths.set(features.contentRegistry)
      config.plugins.add(plugins.generateRegisteredContent(features.contentRegistry), 'after-build')
    }

    if (!!features.defaultMetadata) {
      config.plugins.add(plugins.applyDefaultMetadata(features.defaultMetadata), 'render')
    }

    if (!!features.generators) {
      config.plugins.add(plugins.extractGenerators({}), 'init')
      config.plugins.add(plugins.runGenerators({
        enablePermalinks: !!features.permaLinks
      }), 'build')
    }

    if (!!features.layouts) {
      config.plugins.add(plugins.applyLayouts({ layouts: features.layouts }), 'build')
    }

    if (!!features.staticFiles) {
      Object.keys(features.staticFiles).forEach(source => {
        const destination = features.staticFiles![source]
        config.plugins.add(plugins.copyAssets({
          source, destination
        }), 'build')
      })
    }

    if (!!features.taxonomy) {
      config.plugins.add(plugins.createTaxonomy(), 'generate')
    }

    if (!!features.minify) {
      config.plugins.add(plugins.runMinify(features.minify), 'after-build')
    }

    config.getPlugins().forEach((fn: any) => metalsmith.use(fn))

    tilt.engine = metalsmith
  }
}

export default TiltConfigurator




class PluginManager<T> {
  protected plugins: Map<T, Plugin[]> = new Map()

  add(fn: Plugin, step: T) {
    const list = this.plugins.get(step) || []
    list.push(fn)
    this.plugins.set(step, list)
    return this
  }

  clear() {
    this.plugins.clear()
    return this
  }

  toArray(sequence?: T[]) {
    if (!sequence) sequence = Array.from(this.plugins.keys())
    return _.flattenDeep(
      sequence.map(step => this.plugins.get(step as any) || [])
    )
  }
}