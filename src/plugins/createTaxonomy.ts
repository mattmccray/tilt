import { Taxonomy } from "../core/taxonomies";
import { useTaxonomy } from "../core/hooks";
import Tilt from "../core/tilt";
import Metalsmith from "metalsmith";
import { Fileset } from "../core/types";

/**
 * Creates Taxonomy of all pages with tags or cateogories 
 * @param {any} [options] 
 */
export function createTaxonomy(options?: {}) {
  return (files: Fileset, tilt: Tilt, done: Metalsmith.Callback) => {
    setImmediate(done);

    // Create taxonomy of all content
    const taxonomy = new Taxonomy(files)
    useTaxonomy.set(taxonomy)
  };
}

export default createTaxonomy