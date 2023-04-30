import { onAfterGenerate } from "../lib/lifecycle"

onAfterGenerate((files) => {
  console.log("- Relativizing links...")
  Object.entries(files).forEach(([file, content]) => {
    if (typeof content == 'string') {
      const pathHome = file.split('/')
      pathHome.pop()
      let pathHomeStr = pathHome.map(() => '').join('../')
      if (pathHomeStr == '') pathHomeStr = './'

      files[file] = content.replace(/(href|src)=(["']{1})\/([^/])/g, `$1=$2${pathHomeStr}$3`)
    }
  })
})

