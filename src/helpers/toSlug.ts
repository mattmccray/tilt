import slug from 'slug';

export const toSlug = (target: any, options?: Mode | string) =>
  slug(String(target).toLowerCase(), options)

export default toSlug



interface CharMap {
  [x: string]: string;
}

interface Mode {
  charmap?: CharMap | null;
  lower?: boolean | null;
  multicharmap?: CharMap | null;
  remove?: RegExp | null;
  replacement?: string | null;
  symbols?: boolean | null;
}