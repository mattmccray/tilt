import multimatch from "multimatch";
import { join } from 'path'
import Tilt from "../core/tilt";
import { Fileset, Callback } from "../core/types";

/**
 * Extract front matter from all tilt templates, if exported
 */
export function extractFrontmatter(options: {}) {
  return async (files: Fileset, tilt: Tilt, done: () => void) => {
    const getFullFilePath = (filepath: string) => {
      const engine = tilt as any
      return join(engine._directory, engine._source, filepath)
    };

    const tiltFiles = multimatch(Object.keys(files), "**/*.tilt.js")
    await Promise.all(
      tiltFiles.map(async (file: string) => {
        try {
          const { contents, mode, stats, ...frontmatter } = await import(getFullFilePath(files[file].sourcePath || file)).then(module =>
            module.frontmatter || {});

          Object.assign(files[file], frontmatter)
        } catch (e) {
          console.error("Failed to extract frontmatter from", file);
          console.error(e);
        }
      })
    );

    done()
  };
}

export default extractFrontmatter