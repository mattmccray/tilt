import { Fileset, Page } from "../core/types.js";

export function moveFile(fileset: Fileset, from: string, to: string) {
  const page = fileset[from]
  if (!from) return

  page.filepath = to
  delete fileset[from]

  if (!!fileset[to]) {
    console.warn('Overwriting page at path:', to)
  }

  fileset[to] = page
}

export function updateFilepaths(fileset: Fileset) {
  Object.keys(fileset).forEach(source => {
    const page = fileset[source]
    page.filepath = source
  })
}

export function isTiltTempalte(path: string) {
  return path.endsWith('.tilt.js') //|| path.endsWith('.tile.ts')
}