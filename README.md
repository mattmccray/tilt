# Tilt

Static website toolkit with Metalsmith underpinnings

```
npm install --save-dev @elucidata/tilt
```

## Example Configuration

`build.js`
```js
import { dirname } from 'path';
import { Tilt } from '@elucidata/tilt'
import * as layouts from './theme/layouts.js'

const info = {
  site: {
    title: "A Test Blog",
    author: "Me",
    description: "A simple example of a simple blog. Simple.",
    url: 'http://localhost',
  },
  build: {
    cwd: dirname(new URL(import.meta.url).pathname),
    source: './content',
    destination: './www',
    clean: true,
  }
}

const site = Tilt.configure((site) => { site
  .setBuildInfo(info.build)
  .setSiteInfo(info.site)
  .enableLayouts(layouts)
  .enableGenerators()
  .enableAliases()
  .enableCleanUrls()
  .enableTaxonomy()
  .applyDefaultMetadata({
    "posts/**": {
      layout: "Post",
    },
  })
  .enableCollections({
    "posts/**": {},
  })
  .enableDrafts({
    mode: process.env.NODE_ENV === "production" ? 'purge' : 'mark',
    collections: ["posts"]
  })
  .enableContentRegistry({
    css: `theme/css/shared.css`,
    js: `theme/js/shared.js`
  })
  .copyStaticFiles({
    './assets': './',
    './theme/assets': './theme',
  })
})


console.time("Site built");
console.log("Building...")

site.build((err) => {
  if (err) throw err
  console.timeEnd("Site built");
})
```


