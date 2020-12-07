import multimatch from "multimatch";
import { Callback, Fileset, TiltEngine } from "../core/types"

const DEFAULT_OPTIONS = {
  keyword: '<!--more-->',
  pattern: '**/*.@(md|markdown)'
}

export function extractExcerpts(options: Partial<typeof DEFAULT_OPTIONS> = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options)
  return (files: Fileset, tilt: TiltEngine, done: Callback) => {
    const mdFiles = multimatch(Object.keys(files), options.pattern!)

    mdFiles.forEach((filename: string) => {
      const file = files[filename]
      const contents = file.contents.toString()
      const splitContent = contents.split('\n')
      const keywordIndex = splitContent.indexOf(options.keyword!)

      if (keywordIndex >= 0) {
        const newContents = splitContent.filter(function (line) {
          return line !== options.keyword
        })

        file.contents = newContents.join('\n')  //new Buffer()
        if (!file.excerpt) {
          const except = splitContent.slice(0, keywordIndex).join('\n')
          file.excerpt = except
        }
      } else {
        // Didn't find keyword, using first non-empty paragraph as excerpt
        file.excerpt = splitContent.filter(Boolean)[0]
      }
    })

    setImmediate(done)
  }
}

export default extractExcerpts