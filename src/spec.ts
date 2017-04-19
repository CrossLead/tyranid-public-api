import {
  OAuth2ApplicationSecurity,
  Path,
  Schema,
  Security,
  Spec
} from 'swagger-schema-official';

import { Tyr as Tyranid } from 'tyranid';
import { Options, SchemaContainer } from './interfaces';
import { path } from './path';
import { schema } from './schema';
import { options, yaml } from './utils';

import {
  collectionScopes,
  createSecurityDefinitions
} from './security';

/**
 * Given an instance of tyranid, create a Open API api spec
 *
 * @param Tyr initialized tyranid object
 * @param options schema generation options
 */
export function spec(Tyr: typeof Tyranid, opts: Options & { yaml: true }): string;
export function spec(Tyr: typeof Tyranid, opts?: Options & { yaml?: void | false }): Spec;
export function spec(Tyr: typeof Tyranid, opts: Options = {}): Spec | string {
  const {
    version = "1.0.0",
    description = "Public API generated from tyranid-open-api-spec",
    title = "Public API"
  } = opts;

  const oauth2Scopes = {};

  const spec = {
    swagger: "2.0",
    info: {
      description,
      title,
      version
    },
    schemes: [
      'https'
    ],
    paths: {} as { [key: string]: Path },
    definitions: {} as { [key: string]: Schema }
  };

  const lookup = {} as {[key: string]: SchemaContainer };
  const collections = Tyr.collections.filter(c => c.def.openAPI);

  /**
   * create Open API object schemas for relevant collections / properties
   */
  collections.forEach(col => {
    const result = schema(col.def);
    lookup[result.id] = result;
    spec.definitions[result.name] = result.schema;

    // add scopes for this collection
    Object.assign(oauth2Scopes, collectionScopes(result.name));
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

  Object.assign(spec, {
    securityDefinitions: createSecurityDefinitions(oauth2Scopes)
  });

  return opts.yaml ? yaml(spec) : spec;
}
