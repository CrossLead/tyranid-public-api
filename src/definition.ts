import { Tyr } from 'tyranid';
import { pascalCase } from './utils';

/**
 * container object for a generated swagger definition
 */
export interface SwaggerDefinitionContainer {
  name: string;
  definition: any;
}


/**
 * Given a tyranid schema, produce an object definition
 * to insert into the swagger spec.
 *
 * @param schema a tyranid collection schema definition object
 */
export function definition(
  schema: Tyr.CollectionDefinitionHydrated,
): SwaggerDefinitionContainer {
  const out = {
    name: pascalCase(schema.name),
    definition: {}
  };

  return out;
}