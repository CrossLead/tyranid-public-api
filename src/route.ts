import { Tyr } from 'tyranid';

/**
 * container object for a generated swagger route
 */
export interface SwaggerRouteContainer {
  name: string;
  route: any;
}


/**
 * Given a tyranid schema, produce an object route
 * to insert into the swagger spec.
 *
 * @param schema a tyranid collection schema definition object
 */
export async function route(
  schema: Tyr.CollectionDefinitionHydrated,
): Promise<SwaggerRouteContainer> {
  const out = {
    name: '',
    route: {}
  };


  return out;
}