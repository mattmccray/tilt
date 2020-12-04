import multimatch from "multimatch";
import markdownToHtml from "../helpers/markdownToHtml";
import markdownToText from "../helpers/markdownToText";
import calculateContentStats from "../helpers/calculateContentStats";
import { Fileset } from "../core/types";
import Tilt from "../core/tilt";

/**
 * Handle Markdown
 * Convert all .md files to .html files
 */
export function renderMarkdown(options?: {}) {
  return (files: Fileset, tilt: Tilt, done: () => void) => {
    setImmediate(done);
    multimatch(Object.keys(files), "**/*.md").forEach((file: string) => {
      const fileContents = files[file].contents.toString()
      const markdown = markdownToHtml(fileContents);
      const newFile = file.replace(".md", ".html")

      files[file].filepath = newFile
      files[file].markdown = fileContents;
      files[file].contents = markdown;
      files[file].contentStats = calculateContentStats(markdownToText(markdown))
      files[newFile] = files[file];

      delete files[file];
    });
  };
}

export default renderMarkdown