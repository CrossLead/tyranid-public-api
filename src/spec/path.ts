import { Path, Schema } from 'swagger-schema-official';
import { Tyr } from 'tyranid';
import { PathContainer, SchemaContainer } from '../interfaces';
import { each, error, options, pascal } from '../utils';
import { requireScopes } from './security';

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

  const { name } = schemaDef;

  const out = {
    id: def.id,
    paths: [] as { route: string, path: Path }[]
  };

  const common = {
    produces: [
      'application/json',
      'application/xml'
    ]
  };

  const schemaRef = {
    $ref: `#/definitions/${name}`
  };

  const idParameter = {
    name: 'id',
    in: 'path',
    type: 'string',
    description: `id of the ${name} object`,
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
      ...common,
      ...requireScopes(name, 'read'),
      summary: `retrieve multiple ${name} objects`,
      // TODO: fix typings
      responses: {
        ...denied(),
        ...invalid(),
        ...success(`array of ${name} objects`, {
          type: 'array',
          items: schemaRef
        })
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
      summary: `retrieve an individual ${name} object`,
      ...common,
      ...requireScopes(name, 'read'),
      parameters: [
        idParameter
      ],
      responses: {
        ...denied(),
        ...invalid(),
        ...success(`sends the ${name} object`, schemaRef)
      }
    };
  }

  /**
   * DELETE /<collection>/{id}
   */
  if (includeMethod('delete')) {
    singleIdRoutes.path.delete = {
      ...requireScopes(name, 'write'),
      summary: `delete an individual ${name} object`,
      parameters: [
        idParameter
      ],
      responses: {
        ...denied(),
        ...invalid(),
        ...success(`deletes the ${name} object`)
      }
    };
  }

  /**
   * remove any path entries that don't have any methods
   */
  out.paths = out.paths.filter(p => !!Object.keys(p.path).length);

  return out;
}

/**
 * create a 403 response
 *
 * @param description message for denial
 */
function denied(description = 'permission denied') {
  return { 403: { description } };
}

/**
 * create a 200 response
 * @param description success message
 * @param schema [optional] schema of response body
 */
function success(
  description: string,
  schema?: Schema
) {
  return {
    200: {
      description,
      ...(schema ? { schema } : {})
    }
  };
}

/**
 * create a 400 error object
 *
 * @param description response message
 */
function invalid(description = 'invalid request') {
  return {
    400: {
      description
    }
  };
}
