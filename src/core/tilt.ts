import Metalsmith from "metalsmith";
import { Site } from "./types";
import { useFiles, useSite } from "./hooks";

export type Tilt = Metalsmith

export function Tilt(workingDirectory: string, siteMetadata?: Site) {
  return Metalsmith(workingDirectory)
    .metadata(siteMetadata ?? {})
    .use((files, tilt, done) => {
      Object.keys(files).forEach(originalPath => {
        files[originalPath].originalPath = originalPath
        files[originalPath].filepath = originalPath
      })

      useSite.set(tilt.metadata() as any)
      useFiles.set(files)

      done(null, files, tilt)
    })
}

export default Tilt