import { Files } from 'metalsmith';
import { join } from 'path';
import { getContext, _popContextStack, _pushContextStack } from "../core/context";
import { usePage, useSite } from '../core/hooks';
import Tilt from '../core/tilt';
import { Page } from '../core/types';
import { normalizePageData } from './normalizePages';

export function runGenerators(options?: {}) {
  return async (files: Files, tilt: Tilt, done: () => void) => {
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