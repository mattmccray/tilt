import Metalsmith from "metalsmith";
import { Page, Site, Plugin, Ignore, Callback } from "./types.js";
import { useFiles, useSite } from "./hooks.js";

export type Tilt = TiltInstance //Metalsmith

interface TiltInstance {
  directory(directory: string): TiltInstance;
  directory(): string;
  source(path: string): TiltInstance;
  source(): string;
  destination(path: string): TiltInstance;
  destination(): string;
  concurrency(max: number): TiltInstance;
  concurrency(): number;
  clean(clean: boolean): TiltInstance;
  clean(): boolean;
  frontmatter(frontmatter: boolean): TiltInstance;
  frontmatter(): boolean;
  metadata(metadata: object): TiltInstance;
  metadata(): object;
  use(plugin: Plugin | Plugin[]): TiltInstance;
  ignore(files: string | string[] | Ignore | Ignore[]): TiltInstance;
  ignore(): string[];
  // path(...paths: string[]): string;
  build(fn?: Metalsmith.Callback): object;
}

export function Tilt<T extends Site>(workingDirectory: string, siteMetadata?: T): TiltInstance {
  const metadata = Object.assign(siteMetadata ?? {}, {
    isDevelopment: process.env.NODE_ENV !== "production",
    builtAt: new Date()
  })
  const instance: any = Metalsmith(workingDirectory)
    .metadata(metadata)
    .use((files, tilt, done) => {
      Object.keys(files).forEach(originalPath => {
        files[originalPath].originalPath = originalPath
        files[originalPath].filepath = originalPath
      })

      useSite.set(tilt.metadata() as any)
      useFiles.set(files)

      done(null, files, tilt)
    })

  return instance as TiltInstance
}

// export type Tilt = Metalsmith

export default Tilt







// interface Metalsmith {
//   directory(directory: string): Metalsmith;
//   directory(): string;
//   source(path: string): Metalsmith;
//   source(): string;
//   destination(path: string): Metalsmith;
//   destination(): string;
//   concurrency(max: number): Metalsmith;
//   concurrency(): number;
//   clean(clean: boolean): Metalsmith;
//   clean(): boolean;
//   frontmatter(frontmatter: boolean): Metalsmith;
//   frontmatter(): boolean;
//   metadata(metadata: object): Metalsmith;
//   metadata(): object;
//   use(plugin: Metalsmith.Plugin | Metalsmith.Plugin[]): Metalsmith;
//   ignore(files: string | string[] | Metalsmith.Ignore | Metalsmith.Ignore[]): Metalsmith;
//   ignore(): string[];
//   path(...paths: string[]): string;
//   build(fn?: Metalsmith.Callback): object;
//   process(fn?: Metalsmith.Callback): object;
//   run(files: object, fn?: Metalsmith.Callback): object;
//   run(files: object, plugins: Metalsmith.Plugin[], fn?: Metalsmith.Callback): object;
//   read(dir: string, fn?: Metalsmith.Callback): object;
//   read(fn: Metalsmith.Callback): object;
//   readFile(file: string): object;
//   write(files: object, dir?: string, fn?: Metalsmith.Callback): void;
//   write(files: object, fn: Metalsmith.Callback): void;
//   writeFile(file: string, data: object): void;
// }

// declare function Metalsmith(directory: string): Metalsmith;

// declare namespace Tilt {
//     type Plugin = (files: Fileset, tilt: Tilt, callback: Callback)  => void;
//     type Callback = (err?: Error | null, files?: Fileset, tilt?: Tilt) => void;

//     interface Fileset {
//       [index: string]: Page;
//     }
// }


