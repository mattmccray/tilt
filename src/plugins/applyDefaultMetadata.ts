import multimatch from "multimatch";
import merge from 'mergerino'
import _ from 'lodash'
import { Tilt, Callback, Fileset } from "../core/index.js";

/**
 * Set default layouts
 * 
 * Example:
 * 
 *    applyDefaultMetadataPlugin({
 *      "posts/**": {
 *         layout: "Post",
 *      },
 *      "stories/**": {
 *         sceneBreak: "💣",
 *      }
 *    })  
 * 
 * @param {object} options 
 */
export function applyDefaultMetadata(options: { [path: string]: any }) {
  return (files: Fileset, tilt: Tilt, done: Callback) => {
    setImmediate(done);
    const filenames = Object.keys(files)
    const paths = Object.keys(options)

    paths.forEach(path => {
      const { ...metadata } = options[path] // TODO: Remove 'dangerous' metadata keys.
      multimatch(filenames, path).forEach(setDefaultMetadata(options[path], files))
    })
  };
}

export default applyDefaultMetadata


// Only change fields that aren't in the page
// export 
const setDefaultMetadata = (metadata: any, files: Fileset) => (file: string) => {
  const page = files[file] as any
  const keys = Object.keys(page).filter(k => page[k])
  const merged = merge(page, metadata)
  const safeToUpdate = _.omit(merged, keys)

  Object.assign(page, safeToUpdate)
}
