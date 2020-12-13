import multimatch from "multimatch";
import _ from 'lodash';
import { Tilt, Callback, Fileset, useCollection, TiltEngine, Page } from "../core.js";

export interface CollectionConfig {
  /** defaults to first segment of path-- This will be the key for useCollection(key) */
  name?: string
  /** defaults to '-date-title', a custom sort  */
  sortBy?: string
  /** defaults to false(unless sortBy is '-date-title') */
  reverse?: boolean
/**
 * @deprecated
 * defaults to '' -- You'll probably never need this.
 */
  suffix?: string
}

/**
 * Create collections.
 * 
 * Example:
 * 
 *    createCollectionsPlugin({
 *      "posts/**": {
 *         name: 'posts',  // defaults to first segment of path -- This will be the key for useCollection(key)
 *         sortBy: 'slug', // defaults to '-date-title', a custom sort
 *         reverse: false, // defaults to false (unless sortBy is '-date-title')
 *         suffix: '',     // defaults to '' -- You'll probably never need this.
 *       }
 *    })
 * 
 * @param {Object.<string, CollectionConfig>} options 
 */
export function createCollections(options: { [pathGlob: string]: CollectionConfig }) {
  return (files: Fileset, tilt: TiltEngine, done: Callback) => {
    setImmediate(done);

    Object.keys(options).forEach(path => {
      const { name, sortBy, reverse, suffix } = getConfig(options, path)
      const collection = createCollection(files, path, sortBy, reverse, suffix)
      useCollection.set(name, collection)
    })
  };
}

export default createCollections


function getConfig(options: { [name: string]: CollectionConfig }, path: string) {
  const config = options[path]

  return Object.assign({
    name: path.split('/')[0],
  }, config)
}




function createCollection(files: Fileset, pattern: string, sortField = "-date-title", reverseOrder = false, fieldSuffix = '') {
  const customSort = !sortField || sortField == "-date-title"
  let collection = multimatch(Object.keys(files), pattern) //Object.keys(files)
    .filter((file: any) => files[file].noIndex !== true)
    .map((file: any) => files[file])

  if (customSort)
    collection = collection.sort(sortByDateThenTitle);
  else {
    collection = _.sortBy(collection, sortField)
    if (reverseOrder) collection.reverse()
  }

  collection.forEach((page: any, i: number) => {
    const prev = i > 0
      ? collection[i - 1]
      : null
    const next = i <= collection.length
      ? collection[i + 1]
      : null

    // The collection is reversed...
    if (reverseOrder || customSort) {
      page[`next${fieldSuffix}`] = prev
      page[`hasNext${fieldSuffix}`] = !!prev
      page[`prev${fieldSuffix}`] = next
      page[`hasPrev${fieldSuffix}`] = !!next
    }
    else {
      page[`next${fieldSuffix}`] = next
      page[`hasNext${fieldSuffix}`] = !!next
      page[`prev${fieldSuffix}`] = prev
      page[`hasPrev${fieldSuffix}`] = !!prev
    }
  })

  return collection as Page[]
}

// export default createCollection

interface DateTitleSortable {
  title: string
  date: Date
}

const sortByDateThenTitle = (a: DateTitleSortable, b: DateTitleSortable) => {
  const formatForDateSort = (date: any) =>
    Number(
      date
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")
    );
  const adate = formatForDateSort(a.date);
  const bdate = formatForDateSort(b.date);
  // Sort by date, then alphabetically
  if (adate > bdate) {
    return -1;
  } else if (adate < bdate) {
    return 1;
  } else {
    const aname = a.title.toLowerCase();
    const bname = b.title.toLowerCase();
    if (aname > bname) {
      return -1;
    } else if (aname < bname) {
      return 1;
    } else {
      return 0;
    }
  }
}