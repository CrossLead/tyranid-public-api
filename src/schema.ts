import { Tyr } from 'tyranid';
import { pascalCase, error } from './utils';
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
) {
  const name = pascalCase(def.name);

  const out: SwaggerSchemaContainer = {
    name,
    schema: {
      type: 'object',
      properties: swaggerObject(def.fields)
    }
  };

  return out;
}



/**
 * Convert hash of tyranid fields to hash of swagger schema
 *
 * @param fields hash of tyranid field instances
 */
function swaggerObject(
  fields: { [key: string]: Tyr.FieldInstance },
  path?: string
) {
  const properties: { [key: string]: Schema } = {};
  for (const field in fields) {
    properties[field] = swaggerType(
      fields[field],
      field + (path ? `.${path}` : '')
    );
  }

  return properties;
}



/**
 * Translate a set of tyranid field to a swagger definition
 *
 * @param path property path in schema of current field hash
 * @param field tyranid schema field
 */
function swaggerType(
  field: Tyr.FieldInstance,
  path: string
) {
  if (!field) return error(`no \`def\` property on field: ${path}`);

  /**
   * TODO: should links be refs?
   */
  const type = field.def.link
    ? 'string'
    : field.def.is;

  let schemaObj: Schema;

  switch (type) {

    /**
     * pass through types from tyranid
     */
    case 'password':
    case 'boolean':
    case 'integer':
    case 'double':
    case 'string':
    case 'date': {
      schemaObj = { type };
      break;
    }

    /**
     * string aliases
     */
    case 'mongoid':
    case 'email': {
      schemaObj = { type: 'string' };
      break;
    }

    /**
     * array types
     */
    case 'array': {
      const subfields = field.of;
      if (!subfields) {
        return error(
          `field "${path}" is of type \`array\` but missing an \`of\` property`
        );
      }

      schemaObj = {
        type: 'array',
        items: swaggerType(subfields, `${path}._`)
      }
      break;
    }

    /**
     * nested objects
     */
    case 'object': {
      const keys = field.keys;
      const values = field.of;
      const subfields = field.fields;

      schemaObj = {
        type: 'object'
      }


      /**
       * if the sub object is a hash
       */
      if (keys) {
        if (!values) {
          return error(`
            field "${path}" is of type \`object\` and has a keys
            property but no values property.
          `);
        }

        // TODO: once https://github.com/DefinitelyTyped/DefinitelyTyped/pull/15866 is merged,
        // pull in new typings and remove any cast.
        /* tslint:disable */
        (<any> schemaObj).additionalProperties = swaggerType(values, `${path}.[key: string]`);
        /* tslint:enable */

        break;
      }

      /**
       * if the sub object has a defined schema
       */
      if (!subfields) {
        return error(
          `field "${path}" is of type \`object\` but
          has no \`fields\` property`
        );
      }

      schemaObj.items = swaggerObject(subfields, path);

      break;
    }


    default: return error(`field "${path}" is of unsupported type: ${type}`);
  }

  /**
   * add formats
   */
  switch (schemaObj.type) {

    case 'integer': {
      schemaObj.format = 'i32';
      break;
    }

  }

  /**
   * add note from schema
   */
  if (field.def.note) {
    schemaObj.description = field.def.note;
  }

  return schemaObj;
}