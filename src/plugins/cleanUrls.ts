import { Tilt, Callback, Fileset, TiltEngine } from "../core.js";
import { moveFile } from "../helpers/fileset.js";

/**
 * Clean URLs
 */
export function cleanUrls(options?: {}) {
  return (files: Fileset, tilt: TiltEngine, done: Callback) => {
    setImmediate(done);
    Object.keys(files).forEach(file => {
      const page = files[file]
      const isAdjustable = (
        (file.endsWith('.md') && !file.endsWith('index.md')) ||
        (file.endsWith('.html') && !file.endsWith('index.html')) ||
        (file.endsWith('.html.tilt.js') && !file.endsWith('index.html.tilt.js')) ||
        (file.endsWith('.html.tilt.ts') && !file.endsWith('index.html.tilt.ts')) 
      ) && page.noCleanUrl !== true

      if (!isAdjustable) return

      const newPath = file.endsWith('.html')
        ? file.replace('.html', '/index.html')
        : file.endsWith('.md')
          ? file.replace('.md', '/index.md')
          : file.endsWith('.html.tilt.js')
            ? file.replace('.html.tilt.js', '/index.html.tilt.js')
            : file.replace('.html.tilt.ts', '/index.html.tilt.ts')

      page.sourcePath = file
      page.filepath = file
      moveFile(files, file, newPath)
      // files[newPath] = page
      // delete files[file];
    })
  };
}

export default cleanUrls