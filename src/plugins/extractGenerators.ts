import multimatch from "multimatch";
import { Tilt, Callback, Fileset, Page, setContext } from "../core.js";

/**
 * Collect generators
 */
export function extractGenerators(options?: {}) {
  return (files: Fileset, tilt: Tilt, done: Callback) => {
    setImmediate(done);

    const generators: Page[] = []

    multimatch(Object.keys(files), ["**/*.tilt.{j,t}s"]).forEach((file: string) => {
      if (files[file].generator) {
        files[file].filepath = file
        generators.push(files[file])
        delete files[file]
      }
    })

    // tilt.metadata().generators = generators
    setContext('-generators', generators)
  };
}

export default extractGenerators