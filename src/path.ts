import { Path } from 'swagger-schema-official';
import { Tyr } from 'tyranid';
import { SchemaContainer } from './schema';
import { SchemaOptions } from './spec';
import { each, pascal } from './utils';

/**
 * container object for a generated swagger path
 */
export interface SwaggerPathContainer {
  id: string;
  route: string;
  path: Path;
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

  const out = {
    route: ((typeof opts === 'object') && opts.route) || def.name,
    id: def.id,
    path: {

    } as Path
  };

  // each(def.fields, (field) => {

  // });

  return out;
}
