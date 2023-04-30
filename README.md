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
      assets/
        styles/
          chibi.min.css
        favicon.ico
      components/
        HomePage.tsx
        Layout.tsx
        PostArchivePage.tsx
```


`site/index.ts`
```js
import { configure, onGenerate } from '@elucidata/tilt'
import Layout from './theme/components/Layout'
import HomePage from './theme/components/HomePage'
import PostArchivePage from './theme/components/PostArchivePage'

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
  Object.assign(fileset, copyFiles('site/theme/assets'))

  db.collection('posts').forEach(content => {
    fileset[`/posts/${content.slug}/index.html`] = renderContent(content, Layout)
  })

  fileset['/posts/index.html'] = renderComponent(PostArchivePage, Layout)

  fileset['/index.html'] = renderComponent(HomePage, Layout)
})
```


