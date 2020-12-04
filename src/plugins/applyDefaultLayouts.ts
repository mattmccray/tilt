import multimatch from "multimatch";
import { Tilt, Callback, Fileset } from "../core";

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
  return (files: Fileset, tilt: Tilt, done: Callback) => {
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
