import { Fileset, Page } from "../core/types.js";

export function newFile(fileset: Fileset, filename: string, data: Page) {
  if (!!fileset[filename]) {
    console.warn('Overwriting page at path:', filename)
  }
  fileset[filename] = data

  return data
}

export function removeFile(fileset: Fileset, filename: string) {
  if (!!fileset[filename]) {
    delete fileset[filename]
    return true
  }
  else {
    console.warn('No page to delete at path:', filename)
    return false
  }
}

export function moveFile(fileset: Fileset, from: string, to: string) {
  const page = fileset[from]
  if (!from) return

  page.filepath = to
  removeFile(fileset, from)
  // delete fileset[from]

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