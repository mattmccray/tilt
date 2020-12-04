import Tilt from "../core/tilt";
import { Fileset } from "../core/types";

/**
 * Clean URLs
 */
export function cleanUrls(options?: {}) {
  return (files: Fileset, tilt: Tilt, done: () => void) => {
    setImmediate(done);
    Object.keys(files).forEach(file => {
      const page = files[file]
      const isAdjustable = (
        (file.endsWith('.md') && !file.endsWith('index.md')) ||
        (file.endsWith('.html') && !file.endsWith('index.html')) ||
        (file.endsWith('.html.tilt.js') && !file.endsWith('index.html.tilt.js'))
      ) && page.noCleanUrl !== true

      if (!isAdjustable) return

      const newPath = file.endsWith('.html')
        ? file.replace('.html', '/index.html')
        : file.endsWith('.md')
          ? file.replace('.md', '/index.md')
          : file.replace('.html.tilt.js', '/index.html.tilt.js')

      page.sourcePath = file
      page.filepath = file
      files[newPath] = page
      delete files[file];
    })
  };
}

export default cleanUrls