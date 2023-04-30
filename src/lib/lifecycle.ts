import React from 'react'
import * as fs from 'fs'
import * as path from 'path'
import { Content, ContentDatabase, Config, getFilesInDirectoryRecursivelySync, renderContent } from ".."
import { renderComponent } from "./render"
import { getContext } from "./context"

interface Context {
  db: ContentDatabase
  copyFiles: (targetPath: string, sourcePath: string) => Record<string, { copy: string }>
  renderContent: (content: Content, layout?: any) => string
  renderComponent: <T>(component: React.ComponentType<T>, props: T, layout?: any) => string
}

type FileEntry = string | { copy: string } | (() => string)
type Filelist = Record<string, FileEntry>
type GeneratorCallback = (files: Filelist, ctx: Context) => void

const callbacks = {
  beforeGenerate: [] as GeneratorCallback[],
  generate: [] as GeneratorCallback[],
  afterGenerate: [] as GeneratorCallback[],

}

export function clearHandlers() {
  callbacks.beforeGenerate.length = 0
  callbacks.generate.length = 0
  callbacks.afterGenerate.length = 0
}

export function onBeforeGenerate(callback: GeneratorCallback) {
  callbacks.beforeGenerate.push(callback)
}

export function onGenerate(callback: GeneratorCallback) {
  callbacks.generate.push(callback)
}

export function onAfterGenerate(callback: GeneratorCallback) {
  callbacks.afterGenerate.push(callback)
}

export function runGenerators(): Filelist {
  let files: Filelist = {}
  const { db } = getContext()
  const callbackContext = { db, copyFiles, renderContent, renderComponent }
  const expandFileFunctions = () => Object.entries(files).forEach(([file, getter]) => {
    if (typeof getter == 'function') {
      files[file] = getter()
    }
  })

  callbacks.beforeGenerate.forEach((callback) => {
    callback(files, callbackContext)
  })

  callbacks.generate.forEach((callback) => {
    callback(files, callbackContext)
  })
  expandFileFunctions()

  callbacks.afterGenerate.forEach((callback) => {
    callback(files, callbackContext)
  })
  expandFileFunctions()

  return files
}


function copyFiles(targetPath: string, sourcePath: string, allowProcessingExt: string[] = ['.js', '.css', '.html', '.htm']) {
  let newFiles: any = {}
  getFilesInDirectoryRecursivelySync(sourcePath).forEach((file) => {
    const relativePath = path.relative(sourcePath, file)
    const ext = path.extname(file)

    newFiles[`${targetPath}/${relativePath}`] = allowProcessingExt.includes(ext)
      ? fs.readFileSync(file, 'utf-8').toString()
      : { copy: file }
  })
  return newFiles
}