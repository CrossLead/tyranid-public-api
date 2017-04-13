import { Tyr } from 'tyranid';
import { pascalCase } from './utils';
import { Schema } from 'swagger-schema-official';


/**
 * container object for a generated swagger schema
 */
export interface SwaggerSchemaContainer {
  name: string;
  schema: Schema;
}


/**
 * Given a tyranid schema, produce an object schema
 * to insert into the swagger spec.
 *
 * @param def a tyranid collection schema schema object
 */
export function schema(
  def: Tyr.CollectionDefinitionHydrated,
): SwaggerSchemaContainer {
  const out = {
    name: pascalCase(def.name),
    schema: {}
  };

  return out;
}