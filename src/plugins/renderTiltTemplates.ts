import multimatch from "multimatch";
import { join } from 'path'
import { Tilt, Callback, Fileset, useSite, usePage } from "../core.js";

/**
 * Render tilt templates (before layouts)
 * 
 * We run our templating on the `.tilt.js` files first because some of them 
 * depend on getting *ONLY* the content of a post. So we want to render our
 * post templates last (otherwise our feeds will contain the entire HTML of
 * an individual post, including the <!DOCTYPE> )
 * 
 * @param {*} [options] 
 */
export function renderTiltTemplates(options?: {}) {
  return async (files: Fileset, tilt: Tilt, done: Callback) => {
    const getFilePath = (filepath: string) => join((tilt as any)._directory, (tilt as any)._source, filepath);
    const site = useSite()
    const templateFiles = multimatch(Object.keys(files), "**/*.tilt.{j,t}s");

    await Promise.all(
      templateFiles.map(async (file: string) => {
        try {
          const fn = await import(getFilePath(files[file].sourcePath || file)).then(module => module.default);

          usePage.set(files[file])
          files[file].contents = fn({
            site,
            page: files[file]
          });

          let newPath = file.replace(".tilt.js", "")
          newPath = newPath.replace(".tilt.ts", "")

          files[newPath] = files[file];
          delete files[file];
        }
        catch (e) {
          console.error("Failed to render template for", file);
          console.error(e);
        }
      })
    );

    done()
  };
}

export default renderTiltTemplates