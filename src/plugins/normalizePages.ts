import { basename, extname } from 'path'
import { useFiles } from '../core/hooks';
import Tilt from '../core/tilt';
import { Fileset, Page } from '../core/types';
import toSlug from '../helpers/toSlug';


/**
 * Normalizes page data...
 * - Sets slug from filename
 * - Set date as Date object
 * - Set isoDate as string
 * - Ensures tags are {name, slug}[]
 * - Ensures categories are {name, slug}[][]
 */
export function normalizePages(options?: {}) {
  return (files: Fileset, tilt: Tilt, done: () => void) => {
    setImmediate(done);

    Object.values(files).forEach(normalizePageData)
  };
}

export default normalizePages


/**
 * Normalizes page data...
 * - Sets slug from filename
 * - Set date as Date object
 * - Set isoDate as string
 * - Ensures tags are {name, slug}[]
 * - Ensures categories are {name, slug}[][]
 * @param {import('../hooks.js').Page} page
 */
export const normalizePageData = (page: Page) => {
  const newFilepath = getFilePath(page)

  // Only (re)set the filepath if the new one is different !undefined
  if (page.filepath != newFilepath && !!newFilepath) {
    page.filepath = newFilepath
  }

  // An extra console to tell us if we've named a file wrong
  if (/[A-Z]/.test(page.filepath)) {
    console.log("=====> You've got an uppercase slug ", page.filepath);
  }

  // Derive the slug from the filename
  const slug = basename(page.filepath, extname(page.filepath));
  page.slug = slug

  // Gyrations surrounding the date
  const pageDate = getPageDate(page)
  page.year = pageDate.slice(0, 4);
  page.date = pageDate.length > 10
    ? new Date(pageDate)
    : new Date(pageDate + "T17:00:00.000Z") // If no time, set to noon central
  page.isoDate = page.date.toISOString()

  // Cleanup tags
  const { tags = [] } = page;
  page.tags = tags.map(tag => ({
    name: String(tag).trim(), //.toLowerCase(),
    slug: toSlug(String(tag).trim())
  }))

  // Cleanup categories
  const { categories = [] } = page;
  page.categories = categories.map(cat => {
    if (!Array.isArray(cat)) {
      if (String(cat).indexOf('/')) {
        //@ts-ignore
        cat = String(cat).split('/').map(f => f.trim())
      }
      else {
        cat = [cat]
      }
    }

    return cat.map(c => {
      return {
        name: String(c).trim(),
        slug: toSlug(String(c).trim())
      }
    })
  })
}



export function getPageDate(page: Page) {
  if ('date' in page) {
    if (page.date instanceof Date) return page.date.toISOString()
    else return String(page.date)
  }
  else if ('stats' in page) {
    //@ts-ignore
    return page.stats.mtime.toISOString()
  }
  else {
    return (new Date).toISOString()
  }
}


function getFilePath(page: Page) {
  const files = useFiles()
  return Object.keys(files).find(path => files[path] === page)
}