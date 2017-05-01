"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const security_1 = require("./security");
/**
 * Given a tyranid schema, produce an object path
 * to insert into the Open API spec.
 *
 * @param def a tyranid collection schema definition object
 */
function path(def, lookup) {
    const opts = utils_1.options(def);
    const methods = new Set(opts.methods || ['all']);
    const includeMethod = (route) => methods.has(route) || methods.has('all');
    const pluralize = (str) => str + 's';
    const baseCollectionName = pluralize(def.name);
    const baseRouteParameters = [];
    let baseCollectionRoute = baseCollectionName;
    let parentScopeBase = '';
    /**
     * find id linking to parent
     */
    if (opts.parent) {
        const parentField = utils_1.each(def.fields, (field, name) => {
            if (field.link && field.link.def.name === opts.parent) {
                return { field, name };
            }
        });
        if (!parentField) {
            return utils_1.error(`
        collection ${def.name} has no property linking
        to collection ${opts.parent}
      `);
        }
        const parentId = parentField.field.link.def.id;
        const parentDef = lookup[parentId];
        if (!parentDef) {
            return utils_1.error(`
        parent collection (${parentField.field.link.def.name})
        is not exposed to the public api
      `);
        }
        /**
         * add route parameter
         */
        baseRouteParameters.push({
            name: parentField.name,
            type: 'string',
            in: 'path',
            required: true,
            description: 'ID of linked ' + parentDef.name
        });
        parentScopeBase = pluralize(parentDef.name);
        /**
         * /metrics/{metricId}/metricTargets -> /metrics/{metricId}/targets
         */
        let subRouteName = baseCollectionName;
        if (baseCollectionRoute.indexOf(parentDef.name) === 0) {
            const removed = baseCollectionRoute.replace(parentDef.name, '');
            subRouteName = removed.charAt(0).toLocaleLowerCase() + removed.slice(1);
        }
        /**
         * add route base
         *
         * TODO: we probably want to topologically sort the routes
         *       so we can create parent routes first and then
         *       append child routes to the created parent route
         */
        baseCollectionRoute = [
            pluralize(parentDef.name),
            `{${parentField.name}}`,
            subRouteName
        ].join('/');
    }
    const schemaDef = lookup[def.id];
    if (!schemaDef) {
        return utils_1.error(`
      No schema definition found for collection id = ${def.id}
    `);
    }
    const { name } = schemaDef;
    const out = {
        id: def.id,
        base: baseCollectionName,
        paths: []
    };
    const common = {
        produces: [
            'application/json'
        ]
    };
    const parameters = (...params) => {
        return {
            parameters: [
                ...baseRouteParameters,
                ...params
            ]
        };
    };
    const addScopes = (scope) => {
        const scopes = [];
        if (parentScopeBase) {
            scopes.push(security_1.createScope(parentScopeBase, scope));
        }
        if (!parentScopeBase || !opts.useParentScope) {
            scopes.push(security_1.createScope(baseCollectionName, scope));
        }
        return security_1.requireScopes(...scopes);
    };
    const schemaRef = {
        $ref: `#/definitions/${name}`
    };
    const idParameter = {
        name: 'id',
        in: 'path',
        type: 'string',
        description: `id of the ${name} object`,
        required: true
    };
    /**
     *
     * base routes
     *
     */
    const baseRoutes = {
        route: `/${baseCollectionRoute}`,
        path: {}
    };
    out.paths.push(baseRoutes);
    /**
     * GET /<collection>/
     */
    if (includeMethod('get')) {
        baseRoutes.path.get = Object.assign({}, common, parameters(), addScopes('read'), { summary: `retrieve multiple ${name} objects`, responses: Object.assign({}, denied(), invalid(), success(`array of ${name} objects`, {
                type: 'array',
                items: schemaRef
            })) });
    }
    /**
     *
     * single id routes
     *
     */
    const singleIdRoutes = {
        route: `/${baseCollectionRoute}/{id}`,
        path: {}
    };
    out.paths.push(singleIdRoutes);
    /**
     * GET /<collection>/{id}
     */
    if (includeMethod('get')) {
        singleIdRoutes.path.get = Object.assign({ summary: `retrieve an individual ${name} object` }, common, addScopes('read'), parameters(idParameter), { responses: Object.assign({}, denied(), invalid(), success(`sends the ${name} object`, schemaRef)) });
    }
    /**
     * DELETE /<collection>/{id}
     */
    if (includeMethod('delete')) {
        singleIdRoutes.path.delete = Object.assign({ summary: `delete an individual ${name} object` }, addScopes('write'), parameters(idParameter), { responses: Object.assign({}, denied(), invalid(), success(`deletes the ${name} object`)) });
    }
    /**
     * remove any path entries that don't have any methods
     */
    out.paths = out.paths.filter(p => !!Object.keys(p.path).length);
    return out;
}
exports.path = path;
/**
 * create a 403 response
 *
 * @param description message for denial
 */
function denied(description = 'permission denied') {
    return { 403: { description } };
}
/**
 * create a 200 response
 * @param description success message
 * @param schema [optional] schema of response body
 */
function success(description, schema) {
    return {
        200: Object.assign({ description }, (schema ? { schema } : {}))
    };
}
/**
 * create a 400 error object
 *
 * @param description response message
 */
function invalid(description = 'invalid request') {
    return {
        400: {
            description
        }
    };
}
//# sourceMappingURL=path.js.map