# Tilt

Static website toolkit

```
npm install --save-dev mattmccray/tilt@next
```

## Example Site

```
$/
  content/
    posts/
      hello-world/
        index.md
        cover.jpg
        chart.png
  site/
    index.ts
    theme/
      HomePage.tsx
      Layout.tsx
      PostArchivePage.tsx
```


`site/index.ts`
```js
import { configure, onGenerate } from '@elucidata/tilt'
import Layout from './theme/Layout'
import HomePage from './theme/HomePage'
import PostArchivePage from './theme/PostArchivePage'

configure({
  title: "A Test Blog",
  author: "Me",
  description: "A simple example of a simple blog. Simple.",
  url: 'http://localhost',

  tilt: {
    source: "./content",
    target: "./www"
  }
})

onGenerate((fileset, { db, copyFiles, renderContent, renderComponent }) => {

  db.collection('posts').forEach(content => {
    fileset[`/posts/${content.slug}/index.html`] = renderContent(content, Layout)
  })

  fileset['/posts/index.html'] = renderComponent(PostArchivePage, Layout)

  fileset['/index.html'] = renderComponent(HomePage, Layout)
})
```


