import { Taxonomy } from "../core/taxonomies";
import { Tilt, Callback, Fileset, useTaxonomy } from "../core";

/**
 * Creates Taxonomy of all pages with tags or cateogories 
 * @param {any} [options] 
 */
export function createTaxonomy(options?: {}) {
  return (files: Fileset, tilt: Tilt, done: Callback) => {
    setImmediate(done);

    // Create taxonomy of all content
    const taxonomy = new Taxonomy(files)
    useTaxonomy.set(taxonomy)
  };
}

export default createTaxonomy