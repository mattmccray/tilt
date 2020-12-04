import { Tilt, Callback, Fileset, setContext } from "../core.js";
import getHash from "../helpers/getHash.js";
import contentRegistry, { CONTENT_TYPE_CSS, CONTENT_TYPE_JS } from "../core/registry.js";

/**
 * Extract registered Styles and Scripts, creating files at the specified
 * locations.
 * 
 *    collectRegisteredContentPlugin({
 *      css: 'theme/css/generated.css',
 *      js: 'theme/js/generated.js'
 *    })
 * 
 */
export function collectRegisteredContent({ css: cssPath, js: jsPath, hash = false }: { css: string, js: string, hash: boolean }) {
  return (files: Fileset, tilt: Tilt, done: Callback) => {
    setImmediate(done);

    // Extract generated CSS
    if (cssPath) {
      const contents = contentRegistry.getContentType(CONTENT_TYPE_CSS) //getRegisteredStyles()
      if (hash) {
        const fileHash = getHash(contents)
        cssPath = cssPath.replace('.css', `.${fileHash}.css`)
      }
      files[cssPath] = { filepath: cssPath, contents }
      contentRegistry.clearContentType(CONTENT_TYPE_CSS) // resetStyleRegistry()
    }

    // Extract generated JavaScript
    if (jsPath) {
      const contents = contentRegistry.getContentType(CONTENT_TYPE_JS) //getRegisteredScripts()
      if (hash) {
        const fileHash = getHash(contents)
        jsPath = jsPath.replace('.js', `.${fileHash}.js`)
      }
      files[jsPath] = { filepath: jsPath, contents }
      contentRegistry.clearContentType(CONTENT_TYPE_JS) //resetScriptRegistry()
    }

    setContext('generatedFilePaths', {
      css: cssPath,
      js: jsPath
    })
  };
}

export default collectRegisteredContent