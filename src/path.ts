import { Path } from 'swagger-schema-official';
import { Tyr } from 'tyranid';
import { SchemaContainer } from './schema';
import { SchemaOptions } from './spec';
import { each, error, pascal } from './utils';

/**
 * container object for a generated swagger path
 */
export interface SwaggerPathContainer {
  id: string;
  paths: {
    route: string,
    path: Path;
  }[];
}

/**
 * Given a tyranid schema, produce an object path
 * to insert into the swagger spec.
 *
 * @param def a tyranid collection schema definition object
 */
export function path(
  def: Tyr.CollectionDefinitionHydrated,
  lookup: { [key: string]: SchemaContainer }
): SwaggerPathContainer {
  const opts = def.swagger;
  const base = ((typeof opts === 'object') && opts.route) || (def.name + 's');
  const schemaDef = lookup[def.id];

  if (!schemaDef) {
    return error(`
      No schema definition found for collection id = ${def.id}
    `);
  }

  const out = {
    id: def.id,
    paths: [] as { route: string, path: Path }[]
  };

  const idParameter = {
    name: 'id',
    in: 'path',
    type: 'string',
    description: `id of the ${schemaDef.name} object`,
    required: true
  };

  /**
   * id routes
   */
  out.paths.push({
    route: `/${base}/{id}`,
    path: {

      get: {
        parameters: [
          idParameter
        ],
        responses: {
          200: {
            description: `sends the ${schemaDef.name} object`
          }
        }
      },

      delete: {
        parameters: [
          idParameter
        ],
        responses: {
          200: {
            description: `deletes the ${schemaDef.name} object`
          }
        }
      }

    }
  });

  return out;
}
