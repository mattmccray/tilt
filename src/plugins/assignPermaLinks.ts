import { Tilt, Callback, Fileset, useSite } from "../core/index.js";

/** 
 * Fix all link and permalinks properties... 
 */
export function assignPermaLinks(options?: {}) {
  return (files: Fileset, tilt: Tilt, done: Callback) => {
    setImmediate(done);
    const { url = '' } = useSite()

    Object.keys(files).forEach(file => {
      if (!file.endsWith('.html') && !file.endsWith('.html.tilt.js') && !file.endsWith('.html.tilt.ts')) return

      let link = file.endsWith('index.html')
        ? '/' + file.replace('index.html', '')
        : file.endsWith('index.html.tilt.js')
          ? '/' + file.replace('index.html.tilt.js', '')
          : file.endsWith('index.html.tilt.ts')
            ? '/' + file.replace('index.html.tilt.ts', '')
            : '/' + file

            const permalink = url + link

      files[file].link = link
      files[file].permalink = permalink
    })
  };
}

export default assignPermaLinks