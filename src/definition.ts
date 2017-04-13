import { Tyr } from 'tyranid';

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
export async function definition(
  schema: Tyr.CollectionDefinitionHydrated,
): Promise<SwaggerDefinitionContainer> {
  const out = {
    name: '',
    definition: {}
  };


  return out;
}