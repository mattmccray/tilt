import Tilt from "../core/tilt";
import { Fileset } from "../core/types";

/**
 * Remove any flagged or draft content 
 */
export function removeFlagged(options?: {}) {
  return (files: Fileset, tilt: Tilt, done: () => void) => {
    setImmediate(done);
    Object.keys(files).forEach(file => {
      const isFlaggedContent = (
        (files[file].doNotRender === true)
      )

      if (isFlaggedContent) {
        delete files[file];
      }
    });

  };
}

export default removeFlagged