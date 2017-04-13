import { camelCase } from 'lodash';

/**
 * Convert a string to PascalCase
 *
 * @param str string to convert to Pascal case
 */
export function pascalCase(str: string) {
  return str.charAt(0).toUpperCase() + camelCase(str.slice(1));
}