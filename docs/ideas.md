# Tilt

## Ideas

### Relative Paths Plugin

```js
// In tilt.configure()
site.enableRelativePaths()
```

Takes all `href` and `url` values that start with "/" and relativize them.

For example, a link from from `/index.html` to `/about` would change the link to `./about`. Linking from '/tags/test/index.html` to `/media/cover.jpg` would rewrite the path to `../../media/cover.jpg`.

#### Alternately...

Maybe support an option to pre-pend the site's url instead of using relative paths? '/about' would become 'http://my-site.com/about'