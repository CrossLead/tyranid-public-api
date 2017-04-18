import { safeDump } from 'js-yaml';
import { Tyr } from 'tyranid';


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
      : bit.charAt(0).toLocaleUpperCase() + bit.slice(1)
  }

  return out;
}



/**
 * Throw error with library prefix
 *
 * @param message message to throw
 */
export function error(message: string): never {
  throw new Error(`tyranid-swagger: ${message.replace(/\s+/g, ' ')}`);
}



/**
 * Convert object to yaml
 *
 * @param obj js object
 */
export function yaml(obj: object) {
  return safeDump(obj);
}
