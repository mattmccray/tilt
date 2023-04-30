import { onAfterGenerate } from "../lib/lifecycle"

const doctype = `<!DOCTYPE html>`

onAfterGenerate((files) => {
  console.log("- Adding doctypes...")
  Object.entries(files).forEach(([file, content]) => {
    if (file.endsWith('.html') && typeof content == 'string') {
      const start = content.slice(0, doctype.length)
      if (start == doctype) return

      files[file] = doctype + '\n' + content
    }
  })
})

