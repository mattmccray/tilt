import { Tilt, Callback, Fileset, TiltEngine } from "../core.js";

/**
 * Remove any flagged or draft content 
 */
export function removeFlagged(options?: {}) {
  return (files: Fileset, tilt: TiltEngine, done: Callback) => {
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