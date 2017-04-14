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
      properties: swaggerObject(name, def.fields)
    }
  };

  return out;
}



/**
 * Translate a set of tyranid fields to a swagger object definition
 *
 * @param path property path in schema of current field hash
 * @param fields tyranid schema field hash
 */
function swaggerObject(
  path: string,
  fields: { [key: string]: Tyr.FieldInstance }
) {
  const properties: { [key: string]: Schema } = {};

  for (const name in fields) {
    const field = fields[name];

    if (!field) return error(`no \`def\` property on field: ${path}.${name}`);

    /**
     * TODO: should links be refs?
     */
    const type = field.def.link
      ? 'string'
      : field.def.is;

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
        properties[name] = { type };
        break;
      }

      /**
       * string aliases
       */
      case 'mongoid':
      case 'email': {
        properties[name] = { type: 'string' };
        break;
      }

      /**
       * array types
       */
      case 'array': {
        const subfields = field.of && field.of.fields;
        if (!subfields) {
          return error(
            `field "${path}.${name}" is of type \`array\` but missing an \`of\` property`
          );
        }

        properties[name] = {
          type: 'array',
          items: swaggerObject(`${path}.${name}`, subfields)
        }
        break;
      }


      /**
       * nested objects
       */
      case 'object': {
        const subfields = field.fields;
        if (!subfields) {
          return error(
            `field "${path}.${name}" is of type \`object\` but has no \`fields\` property`
          );
        }

        properties[name] = {
          type: 'array',
          items: swaggerObject(`${path}.${name}`, subfields)
        }
        break;
      }


      default: return error(`field "${path}.${name}" is of unsupported type: ${type}`);
    }

  }

  return properties;
}