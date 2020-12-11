import { join } from 'path';
import { Callback, Fileset, getContext, Page, TiltEngine, usePage } from "../core.js";
import { _popContextStack, _pushContextStack } from "../core/context.js";
import { createGenerator } from '../core/generators.js';

export function runGenerators(options?: {}) {
  return async (files: Fileset, tilt: TiltEngine, done: Callback) => {
    const getFilePath = (filepath: string) => join((tilt as any)._directory, (tilt as any)._source, filepath);

    const generators = getContext('-generators') || []
    const genny = createGenerator(files)
    
    // Run generateors
    await Promise.all(
      generators.map(async (page: Page) => {
        try {
          _pushContextStack()

          const file = page.filepath
          const fn = await import(getFilePath(file)).then(module => module.default);

          usePage.set(page)

          fn(genny) // The generator script will use the genny to create new content files
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