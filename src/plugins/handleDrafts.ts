import multimatch from "multimatch";
import { Tilt, Callback, Fileset, TiltEngine } from "../core.js";
import { moveFile } from "../helpers/fileset.js";

/**
 * Removes or promotes draft pages.
 * 
 * Example options
 * 
 *    handleDraftsPlugin({
 *      markOnly: node.process.NODE_ENV !== 'production',
 *      paths: ['posts', 'stories']
 *    })
 * 
 */
export function handleDrafts({ paths, markOnly = false }: { paths: string[], markOnly?: boolean }) {
  return (files: Fileset, tilt: TiltEngine, done: Callback) => {
    setImmediate(done);

    paths.forEach((path) => {
      if (path.endsWith('/')) path = path.substr(0, path.length - 1)

      multimatch(Object.keys(files), [`${path}/drafts/**`]).forEach((file: string) => {
        if (markOnly) {
          // Mark file as a draft
          files[file].draft = true
          files[file].tags = (files[file].tags || []).concat({ name: 'draft', slug: 'draft' })
          files[file].categories = (files[file].categories || []).concat([[{ name: 'Drafts', slug: 'drafts' }]])
          // Promote the file 
          moveFile(files, file, file.replace("/drafts", ""))
          // files[file.replace("/drafts", "")] = files[file]
        }
        else {
          // Remove  draft
          delete files[file];
        }
      });
    })
  };
}

export default handleDrafts