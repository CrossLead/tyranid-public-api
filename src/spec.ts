import { Path, Schema, Spec } from 'swagger-schema-official';
import { Tyr as Tyranid } from 'tyranid';
import { Options, SchemaContainer } from './interfaces';
import { path } from './path';
import { schema } from './schema';
import { yaml } from './utils';


/**
 * Given an instance of tyranid, create a swagger api spec
 *
 * @param Tyr initialized tyranid object
 * @param options schema generation options
 */
export function spec(Tyr: typeof Tyranid, options?: Options & { yaml: true }): string;
export function spec(Tyr: typeof Tyranid, options?: Options & { yaml: void | false }): Spec;
export function spec(Tyr: typeof Tyranid, options: Options = {}): Spec | string {
  const {
    version = "1.0.0",
    description = "Public API generated from tyranid-swagger",
    title = "Public API"
  } = options;

  const spec = {
    swagger: "2.0",
    info: {
      description,
      title,
      version
    },
    paths: {} as { [key: string]: Path },
    definitions: {} as { [key: string]: Schema }
  };

  const lookup = {} as {[key: string]: SchemaContainer };
  const collections = Tyr.collections.filter(c => !!c.def.swagger);

  /**
   * create swagger object schemas for relevant collections / properties
   */
  collections.forEach(col => {
    const result = schema(col.def);
    lookup[result.id] = result;
    spec.definitions[result.name] = result.schema;
  });

  /**
   * create routes referencing relevant schema
   */
  collections.forEach(col => {
    const result = path(col.def, lookup);
    const paths = result.paths;
    for (const p of paths) {
      spec.paths[p.route] = p.path;
    }
  });

  return options.yaml ? yaml(spec) : spec;
}
