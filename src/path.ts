import { Path } from 'swagger-schema-official';
import { Tyr } from 'tyranid';
import { PathContainer, SchemaContainer } from './interfaces';
import { each, error, options, pascal } from './utils';

/**
 * Given a tyranid schema, produce an object path
 * to insert into the Open API spec.
 *
 * @param def a tyranid collection schema definition object
 */
export function path(
  def: Tyr.CollectionDefinitionHydrated,
  lookup: { [key: string]: SchemaContainer }
): PathContainer {
  const opts = options(def);
  const methods = new Set(opts.methods || [ 'all' ]);
  const includeMethod = (route: string) => methods.has(route) || methods.has('all');
  const base = opts.route || (def.name + 's');
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

  const schemaRef = {
    $ref: `#/definitions/${schemaDef.name}`
  };

  const idParameter = {
    name: 'id',
    in: 'path',
    type: 'string',
    description: `id of the ${schemaDef.name} object`,
    required: true
  };

  /**
   *
   * base routes
   *
   */
  const baseRoutes = {
    route: `/${base}`,
    path: {} as Path
  };
  out.paths.push(baseRoutes);

  /**
   * GET /<collection>/
   */
  if (includeMethod('get')) {
    baseRoutes.path.get = {
      summary: `retrieve multiple ${schemaDef.name} objects`,
      responses: {
        200: {
          description: `array of ${schemaDef.name} objects`,
          schema: {
            type: 'array',
            items: schemaRef
          }
        }
      }
    };
  }

  /**
   *
   * single id routes
   *
   */
  const singleIdRoutes = {
    route: `/${base}/{id}`,
    path: {} as Path
  };
  out.paths.push(singleIdRoutes);

  /**
   * GET /<collection>/{id}
   */
  if (includeMethod('get')) {
    singleIdRoutes.path.get = {
      summary: 'retrieve an individual ${schemaDef.name} object',
      parameters: [
        idParameter
      ],
      responses: {
        200: {
          description: `sends the ${schemaDef.name} object`,
          schema: schemaRef
        }
      }
    };
  }

  /**
   * DELETE /<collection>/{id}
   */
  if (includeMethod('delete')) {
    singleIdRoutes.path.delete = {
      summary: 'delete an individual ${schemaDef.name} object',
      parameters: [
        idParameter
      ],
      responses: {
        200: {
          description: `deletes the ${schemaDef.name} object`
        }
      }
    };
  }

  /**
   * remove any path entries that don't have any methods
   */
  out.paths = out.paths.filter(p => !!Object.keys(p.path).length);

  return out;
}
