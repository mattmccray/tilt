import multimatch from "multimatch";
import Tilt from "../core/tilt";
import { Fileset } from "../core/types";

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
  return (files: Fileset, tilt: Tilt, done: () => void) => {
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
          files[file.replace("/drafts", "")] = files[file]
        }
        // Remove original draft
        delete files[file];
      });
    })
  };
}

export default handleDrafts