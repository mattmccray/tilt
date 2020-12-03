# tilt
Static website toolkit with Metalsmith underpinnings


`tilt.ts`
```ts
import Tilt from 'tilt'

const SiteInfo = {
  title: "My Site",
  subtitle: "Where fun things go to die."
}

export type ISiteInfo = typeof SiteInfo

const site = new Tilt((config) => {
  config
    .root(__dirName)
    .metadata(SiteInfo)
    .source('./content')
    .destination('./www')
    .clean(true)
    .ignore(["**/.DS_Store", "**/.thumbsdb"])
})

site
  .use(pluginA)
  .use(pluginB)
  .use(pluginC)

export default site
```