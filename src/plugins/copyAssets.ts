import PluginAssets from 'metalsmith-assets'

/**
 * Copy assets into the Fileset.
 * 
 *    copyAssetsPlugin({
 *      source: './assets', // relative to the working directory
 *      destination: './' // relative to the build directory
 *    })
 * 
 * @param {{ source: string, destination: string}} options 
 * @returns {any}
 */
export function copyAssets(options: { source: string, destination: string }) {
  return PluginAssets(options)
}

export default copyAssets