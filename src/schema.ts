import { Tyr } from 'tyranid';
import { pascal, error } from './utils';
import { Schema } from 'swagger-schema-official';



/**
 * container object for a generated swagger schema
 */
export interface SchemaContainer {
  name: string;
  schema: Schema;
}


/**
 * additional properties on tyranid schema
 * used by tyranid-swagger
 */
export interface SchemaAnnotation {

  /**
   * expose property to public api
   */
  public?: boolean;

}



/**
 * strings for elements in property path
 * that do not have names
 */
const PATH_MARKERS = {
  ARRAY: '_',
  HASH: '[key: string]'
};



/**
 * Given a tyranid schema, produce an object schema
 * to insert into the swagger spec.
 *
 * @param def a tyranid collection schema schema object
 */
export function schema(
  def: Tyr.CollectionDefinitionHydrated,
) {
  const name = pascal(def.name);

  const out: SchemaContainer = {
    name,
    schema: {
      type: 'object',
      properties: swaggerObject(def.fields)
    }
  };

  return out;
}




/**
 * mark fields to include in public api
 */
function mark() {


}



/**
 * extend a given path with a new property
 *
 * @param path current path
 * @param next name of next property
 */
function extendPath(
  next: string,
  path?: string
) {
  if (!path) return next;
  return `${path}.${next}`;
}




/**
 * Convert hash of tyranid fields to hash of swagger schema
 *
 * @param fields hash of tyranid field instances
 * @param path property path in schema of current field hash
 */
function swaggerObject(
  fields: { [key: string]: Tyr.FieldInstance },
  path?: string
) {
  const properties: { [key: string]: Schema } = {};
  for (const field in fields) {
    properties[field] = swaggerType(
      fields[field],
      extendPath(field, path)
    );
  }

  return properties;
}



/**
 * Translate a tyranid field to a swagger definition
 *
 * @param field tyranid schema field
 * @param path property path in schema of current field
 */
function swaggerType(
  field: Tyr.FieldInstance,
  path: string
) {
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
        return error(`
          field "${path}" is of type \`array\`
          but missing an \`of\` property
        `);
      }

      schemaObj = {
        type: 'array',
        items: swaggerType(
          subfields,
          extendPath(PATH_MARKERS.ARRAY, path)
        )
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
        (<any> schemaObj).additionalProperties = swaggerType(
          values,
          extendPath(PATH_MARKERS.HASH, path)
        );
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

