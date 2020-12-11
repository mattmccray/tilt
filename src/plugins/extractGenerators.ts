import multimatch from "multimatch";
import { Tilt, Callback, Fileset, Page, setContext, TiltEngine } from "../core.js";
import { isGeneratorPage } from "../core/generators.js";

/**
 * Collect generators
 */
export function extractGenerators(options?: {}) {
  return (files: Fileset, tilt: TiltEngine, done: Callback) => {
    setImmediate(done);

    const generators: Page[] = []

    multimatch(Object.keys(files), ["**/*.tilt.{j,t}s"]).forEach((file: string) => {
      if (isGeneratorPage(files[file])) {
        files[file].filepath = file
        generators.push(files[file])
        delete files[file]
      }
    })

    setContext('-generators', generators)
  };
}

export default extractGenerators