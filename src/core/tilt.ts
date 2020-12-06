import Metalsmith from "metalsmith";
import { TiltConfigurator } from "./configurator.js";
import { useFiles, useSite } from "./hooks.js";
import { Fileset, Plugin, Site } from "./types.js";

export class Tilt {
  engine: Metalsmith | undefined

  private constructor() { }

  build(cb: (error?: any) => void): Fileset {
    if (!this.engine) throw new Error("Tilt not configured.")

    const meta = this.engine.metadata()
    this.engine.metadata(Object.assign(meta, { builtAt: new Date() }))
    return this.engine.build(cb) as Fileset
  }

  static configure(configure: (config: TiltConfigurator) => void): Tilt {
    const site = new Tilt()
    const configurator = new TiltConfigurator(site)
    configure(configurator)
    TiltConfigurator.finalize(site, configurator)
    return site
  }
}

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
