import { Tilt, Callback, Fileset } from "../core/index.js";

/**
 * Remove any flagged or draft content 
 */
export function removeFlagged(options?: {}) {
  return (files: Fileset, tilt: Tilt, done: Callback) => {
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