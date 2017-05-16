import * as AJV from 'ajv';
import { Tyr } from 'tyranid';
import { CollectionSchemaOptions, FieldSchemaOptions } from './interfaces';
import { Spec } from 'swagger-schema-official';
/**
 * Convert a string to PascalCase
 *
 * @param str string to convert to Pascal case
 */
export declare function pascal(str: string): string;
/**
 * Throw error with library prefix
 *
 * @param message message to throw
 */
export declare function error(message: string): never;
/**
 * Convert object to yaml
 *
 * @param obj js object
 */
export declare function yaml(obj: object): string;
/**
 * Iterate over properties in object
 *
 * @param obj javascript object
 * @param fn iteree function
 */
export declare function each<T, S>(obj: {
    [key: string]: T;
}, fn: (element: T, field: string) => S): S | undefined;
/**
 * Get options from schema
 *
 * @param def tyranid collection or field definition with optional Open API opts
 */
export declare function options(def: Tyr.CollectionDefinitionHydrated): CollectionSchemaOptions;
export declare function options(def: Tyr.FieldDefinition): FieldSchemaOptions;
/**
 * Validate a spec against the openAPI spec schema
 *
 * @param spec open api spec object
 */
export declare function validate(spec: Spec): {
    valid: boolean | AJV.Thenable<any>;
    errors: AJV.ErrorObject[];
};
/**
 * return subset object of obj
 *
 * @param obj javascript object
 * @param keys array of keys of obj
 */
export declare function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
