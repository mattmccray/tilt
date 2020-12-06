import { useSite } from "../core/hooks.js";
import { Page } from "../core/types.js";

export function urlFor(page: Page | string, fullURL = false): string {
  let path = typeof page === 'string' ? page : page.filepath
  const { url = '' } = useSite()

  path = path.endsWith('index.html')
    ? '/' + path.replace('index.html', '')
    : '/' + path

  return fullURL
    ? url + path
    : path
}

export default urlFor