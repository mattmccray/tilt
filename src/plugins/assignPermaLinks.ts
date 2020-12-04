import Metalsmith from "metalsmith";
import { useSite } from "../core/hooks";
import Tilt from "../core/tilt";
import { Fileset } from "../core/types";

/** 
 * Fix all link and permalinks properties... 
 */
export function assignPermaLinks(options?: {}) {
  return (files: Fileset, tilt: Tilt, done: Metalsmith.Callback) => {
    setImmediate(done);
    const { url = '' } = useSite()

    Object.keys(files).forEach(file => {
      if (!file.endsWith('.html') && !file.endsWith('.html.tilt.js')) return

      let link = file.endsWith('index.html')
        ? '/' + file.replace('index.html', '')
        : file.endsWith('index.html.tilt.js')
          ? '/' + file.replace('index.html.tilt.js', '')
          : '/' + file
      const permalink = url + link

      files[file].link = link
      files[file].permalink = permalink
    })
  };
}

export default assignPermaLinks