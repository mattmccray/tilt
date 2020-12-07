import multimatch from "multimatch";
import minify from 'minify'
import { join } from 'path'
import { Tilt, Callback, Fileset, useSite, usePage, TiltEngine } from "../core.js";
import { moveFile } from "../helpers/fileset.js";

/**
 * Minify HTML, CSS, and JS
 * 
 * 
 * 
 * @param {*} [options] 
 */

export interface MinifyOptions {
  html?: {}
  css?: {}
  js?: {}
  // img?: {}
}

export function runMinify(options?: MinifyOptions) {
  return async (files: Fileset, tilt: TiltEngine, done: Callback) => {

    const targetExts = []

    if (!!options && !!options.css) targetExts.push('css')
    if (!!options && !!options.js) targetExts.push('js')
    if (!!options && !!options.html) targetExts.push('html')
    // if (!!options && !!options.img) {
    //   targetExts.push('jpg')
    //   targetExts.push('gif')
    //   targetExts.push('png')
    // }

    // const templateFiles = multimatch(Object.keys(files), targetExts.map(ext => `**/*.${ext}`));

    if (!!options && typeof options.html == 'boolean') {
      options.html = {
        removeAttributeQuotes: false,
        removeOptionalTags: false
      }
    }

    await targetExts.map(async (ext) => {
      const templateFiles = multimatch(Object.keys(files), `**/*.${ext}`);
      //@ts-ignore
      const compressor = minify[ext]

      return await Promise.all(
        templateFiles.map(async (file: string) => {
          try {
            const page = files[file]
            const newContent = await compressor(page.contents.toString(), options)
            files[file].contents = newContent
          }
          catch (e) {
            console.error("Failed to render template for", file);
            console.error(e);
          }
        })
      );
    })

    done();
  };
}

export default runMinify