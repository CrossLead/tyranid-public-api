import { Path } from 'swagger-schema-official';
import { Tyr } from 'tyranid';

/**
 * container object for a generated swagger path
 */
export interface SwaggerPathContainer {
  name: string;
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
): SwaggerPathContainer {
  const out = {
    name: '',
    path: {}
  };

  return out;
}
