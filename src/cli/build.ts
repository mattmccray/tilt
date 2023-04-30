import * as fs from 'fs'
import * as path from 'path'
import { initContext } from "../lib/context"
import { runGenerators } from '../lib/lifecycle'

console.log('Tilt')

const target = process.argv[(process.argv.findIndex((arg) => arg == __filename) ?? 0) + 1]
require(path.join(process.cwd(), target))

const ctx = initContext()
const { config } = ctx
console.log('config:', config)

console.log('Generating...')
const files = runGenerators()

console.log('Writing files...')
Object.entries(files).forEach(([file, content]) => {
  console.log('-', file)
  if (typeof content == 'function') content = content()
  if (typeof content == 'object' && content.copy) {
    const source = content.copy
    const target = path.join(config.tilt.output, file)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(source, target)
    return
  }
  if (typeof content == 'string') {
    const target = path.join(config.tilt.output, file)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, content)
    return
  }
  else {
    console.log('    unknown content type:', typeof content)
  }
})
