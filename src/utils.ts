import * as AJV from 'ajv';
import { safeDump } from 'js-yaml';
import { Spec } from 'swagger-schema-official';
import { Tyr } from 'tyranid';
import { SchemaOptions } from './interfaces';

/**
 * Convert a string to PascalCase
 *
 * @param str string to convert to Pascal case
 */
export function pascal(str: string) {
  const bits = str
    .trim()
    .replace(/[^a-zA-Z0-9]+/gm, '_')
    .split('_');

  let out = '';
  for (const bit of bits) {
    out += bit.length < 2
      ? (bit || '').toLocaleUpperCase()
      : bit.charAt(0).toLocaleUpperCase() + bit.slice(1);
  }

  return out;
}

/**
 * Throw error with library prefix
 *
 * @param message message to throw
 */
export function error(message: string): never {
  throw new Error(`tyranid-open-api-spec: ${message.replace(/\s+/g, ' ')}`);
}

/**
 * Convert object to yaml
 *
 * @param obj js object
 */
export function yaml(obj: object) {
  return safeDump(obj, {
    noRefs: true
  });
}

/**
 * Iterate over properties in object
 *
 * @param obj javascript object
 * @param fn iteree function
 */
export function each<T>(
  obj: { [key: string]: T },
  fn: (element: T, field: string) => boolean | void
) {
  for (const field in obj) {
    if (obj.hasOwnProperty(field)) {
      if (fn(obj[field], field)) break;
    }
  }
}

/**
 * Get options from schema
 *
 * @param def tyranid collection or field definition with optional Open API opts
 */
export function options(def: { openAPI?: SchemaOptions }) {
  const openAPI = def.openAPI;
  return (typeof openAPI === 'object' && openAPI) || {};
}

/**
 * Validate a spec against the openAPI spec schema
 *
 * @param spec open api spec object
 */
export function validate(spec: Spec) {
  const ajv = new AJV({ validateSchema: true });

  /* tslint:disable */
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
  const openAPIJSONSchema = require('swagger-schema-official/schema.json');
  /* tslint:enable */

  return ajv.validate(openAPIJSONSchema, spec);
}
