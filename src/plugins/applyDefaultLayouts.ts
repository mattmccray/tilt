import Metalsmith from "metalsmith";
import multimatch from "multimatch";
import Tilt from "../core/tilt";
import { Fileset } from "../core/types";

/**
 * Set default layouts
 * 
 * Example:
 * 
 *    applyDefaultLayoutsPlugin({
 *      "posts/**": "Post"
 *    })  
 * 
 * @param {object} options 
 */
export function applyDefaultLayoutsPlugin(options: { [path: string]: string }) {
  return (files: Fileset, tilt: Tilt, done: Metalsmith.Callback) => {
    setImmediate(done);
    const filenames = Object.keys(files)
    const paths = Object.keys(options)

    paths.forEach(path => {
      multimatch(filenames, path).forEach(setDefaultLayout(options[path], files))
    })
  };
}

export default applyDefaultLayoutsPlugin


export const setDefaultLayout = (layout: string, files: Fileset, force = false) => (file: string) => {
  // Set the layout
  files[file].layout = force
    ? layout
    : files[file].layout || layout;
}
