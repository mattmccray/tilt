import { join } from 'path';
import { Tilt, Callback, Fileset, Page, usePage, useSite, getContext, TiltEngine } from "../core.js";
import { normalizePageData } from './normalizePages.js';
import { _popContextStack, _pushContextStack } from "../core/context.js";

export function runGenerators(options?: {}) {
  return async (files: Fileset, tilt: TiltEngine, done: Callback) => {
    const getFilePath = (filepath: string) => join((tilt as any)._directory, (tilt as any)._source, filepath);

    const site = useSite()
    const generators = getContext('-generators') || []

    // Run generateors
    await Promise.all(
      generators.map(async (page: Page) => {
        try {
          _pushContextStack()
          const file = page.filepath
          const fn = await import(getFilePath(file)).then(module => module.default);

          usePage.set(page)

          const newContent: { [path: string]: Page } = fn({
            site, files,
          });

          if (!newContent) {
            console.log("Generator returned no content.", page.filepath)
            return
          }

          Object.values(newContent).forEach(normalizePageData)
          Object.assign(files, newContent)
        }
        catch (e) {
          console.error("Failed to run generator:", page.filepath);
          console.error(e);
        }
        finally {
          _popContextStack()
        }
      })
    );

    done()
  };
}

export default runGenerators