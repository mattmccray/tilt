import { Tilt, Callback, Fileset, Component, LayoutComponent, usePage, useSite, TiltEngine } from "../core.js";

export interface Layouts { [name: string]: LayoutComponent }

/**
 * Handle Templating (use last of all)
 * 
 * Render the templates and/or layouts for all applicable files
 *
 * Any files (.md) with front-matter in them that indicate a `layout` get
 * rendered with that layout with `site` AND `page` data.
 * 
 *    ({ site, page }) => {}
 * 
 * Any files marked as templates get passed ONLY the `site` data so they can
 * render themselves.
 *   
 *    (site) => CustomLayout({ site, page: {...} }, children)
 * 
 */
export function applyLayouts({ layouts }: { layouts: Layouts }) {
  return async (files: Fileset, tilt: TiltEngine, done: Callback) => {
    const layoutFiles = Object.keys(files).filter(file => files[file].layout);
    const site = useSite()

    await Promise.all(
      layoutFiles.map(async file => {
        const fn = layouts[files[file].layout!];

        if (fn) {
          usePage.set(files[file])

          files[file].contents = fn({
            site,
            page: files[file]
          }, files[file].contents.toString());
        }
        else {
          console.warn("Layout not found:", files[file].layout)
        }
      })
    );

    done()
  };
}

export default applyLayouts