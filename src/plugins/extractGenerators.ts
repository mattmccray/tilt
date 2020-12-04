import multimatch from "multimatch";
import { setContext } from "../core/context";
import Tilt from "../core/tilt";
import { Fileset, Page } from "../core/types";

/**
 * Collect generators
 */
export function extractGenerators(options?: {}) {
  return (files: Fileset, tilt: Tilt, done: () => void) => {
    setImmediate(done);

    const generators: Page[] = []

    multimatch(Object.keys(files), ["**/*.tilt.js"]).forEach((file: string) => {
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