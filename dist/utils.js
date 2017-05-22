"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AJV = require("ajv");
const js_yaml_1 = require("js-yaml");
/**
 * Convert a string to PascalCase
 *
 * @param str string to convert to Pascal case
 */
function pascal(str) {
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
exports.pascal = pascal;
/**
 * Throw error with library prefix
 *
 * @param message message to throw
 */
function error(message) {
    throw new Error(`tyranid-open-api-spec: ${message.replace(/\s+/g, ' ')}`);
}
exports.error = error;
/**
 * Convert object to yaml
 *
 * @param obj js object
 */
function yaml(obj) {
    return js_yaml_1.safeDump(obj);
}
exports.yaml = yaml;
/**
 * Iterate over properties in object
 *
 * @param obj javascript object
 * @param fn iteree function
 */
function each(obj, fn) {
    for (const field in obj) {
        if (obj.hasOwnProperty(field)) {
            const result = fn(obj[field], field);
            if (typeof result !== 'undefined')
                return result;
        }
    }
}
exports.each = each;
function options(def) {
    const openAPI = def.openAPI;
    const opts = (typeof openAPI === 'object' && openAPI) || {};
    return opts;
}
exports.options = options;
/**
 * Validate a spec against the openAPI spec schema
 *
 * @param spec open api spec object
 */
function validate(spec) {
    const ajv = new AJV({ validateSchema: true });
    /* tslint:disable */
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
    const openAPIJSONSchema = require('swagger-schema-official/schema.json');
    /* tslint:enable */
    const result = ajv.validate(openAPIJSONSchema, spec);
    return {
        valid: result,
        errors: (ajv.errors || []).slice()
    };
}
exports.validate = validate;
/**
 * return subset object of obj
 *
 * @param obj javascript object
 * @param keys array of keys of obj
 */
function pick(obj, keys) {
    const out = {};
    for (const key of keys) {
        out[key] = obj[key];
    }
    return out;
}
exports.pick = pick;
/**
 * "My String" -> "MY_STRING"
 * @param str string
 */
function upperSnake(str) {
    return str.split(/\s+/).join('_').toUpperCase();
}
exports.upperSnake = upperSnake;
//# sourceMappingURL=utils.js.map