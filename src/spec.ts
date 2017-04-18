import { Path, Schema, Spec } from 'swagger-schema-official';
import { Tyr as Tyranid } from 'tyranid';
import { path } from './path';
import { schema, SchemaContainer } from './schema';
import { yaml } from './utils';

/**
 * Swagger options listed in tyranid schema annotations
 */
export type SchemaOptions = boolean | {

  /**
   * methods to generate for this field
   */
  methods?: Array<'get' | 'post' | 'put' | 'delete'>;

  /**
   * description to use instead of the main field note
   */
  note?: string;

  /**
   * scopes required for this field
   */
  scopes?: string[];

  /**
   * custom route name for collection
   */
  route?: string;
};

/**
 * options for spec generation
 */
export interface Options {
  /**
   * api version, defaults to 1
   */
  version?: string;
  /**
   * description of public api
   */
  description?: string;
  /**
   * title of public api
   */
  title?: string;
  /**
   * return yaml string
   */
  yaml?: boolean;
}

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
    spec.paths[result.route] = result.path;
  });

  return options.yaml ? yaml(spec) : spec;
}
