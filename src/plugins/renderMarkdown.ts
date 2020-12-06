import multimatch from "multimatch";
import markdownToHtml from "../helpers/markdownToHtml.js";
import markdownToText from "../helpers/markdownToText.js";
import calculateContentStats from "../helpers/calculateContentStats.js";
import { Tilt, Callback, Fileset, TiltEngine } from "../core.js";
import { moveFile } from "../helpers/fileset.js";

/**
 * Handle Markdown
 * Convert all .md files to .html files
 */
export function renderMarkdown(options?: {}) {
  return (files: Fileset, tilt: TiltEngine, done: Callback) => {
    setImmediate(done);
    multimatch(Object.keys(files), "**/*.md").forEach((file: string) => {
      const fileContents = files[file].contents.toString()
      const markdown = markdownToHtml(fileContents);
      const newFile = file.replace(".md", ".html")

      files[file].filepath = newFile
      files[file].markdown = fileContents;
      files[file].contents = markdown;
      files[file].contentStats = calculateContentStats(markdownToText(markdown))
      moveFile(files, file, newFile)
      // files[newFile] = files[file];
      // delete files[file];
    });
  };
}

export default renderMarkdown