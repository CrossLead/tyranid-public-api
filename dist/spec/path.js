"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const base_find_parameters_1 = require("./base-find-parameters");
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
            description: 'ID of linked ' + parentDef.name,
            ['x-tyranid-openapi-object-id']: true
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
    const { name, pascalName, schema } = schemaDef;
    const putPostSchema = JSON.parse(JSON.stringify(schemaDef.schema));
    delete putPostSchema.properties._id;
    const out = {
        id: def.id,
        base: baseCollectionName,
        paths: []
    };
    const common = {
        ['x-tyranid-openapi-collection-id']: def.id
    };
    const returns = {
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
        $ref: `#/definitions/${pascalName}`
    };
    const idParameter = {
        name: '_id',
        in: 'path',
        type: 'string',
        description: `ID of the ${pascalName} object`,
        required: true
    };
    idParameter['x-tyranid-openapi-object-id'] = true;
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
        baseRoutes.path.get = Object.assign({}, common, returns, parameters(...base_find_parameters_1.default), addScopes('read'), { summary: `retrieve multiple ${name} objects`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`array of ${name} objects`, {
                type: 'array',
                items: schemaRef
            })) });
    }
    /**
     * POST /<collection>/
     */
    if (includeMethod('post')) {
        baseRoutes.path.post = Object.assign({}, common, returns, addScopes('write'), parameters({
            name: 'data',
            in: 'body',
            description: `New ${pascalName} object`,
            required: true,
            schema: putPostSchema
        }), { summary: `create a new ${name} object`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`created ${name} object`, schemaRef)) });
    }
    /**
     * PUT /<collection>/
     */
    if (includeMethod('put')) {
        baseRoutes.path.put = Object.assign({}, common, returns, addScopes('write'), parameters({
            name: 'data',
            in: 'body',
            description: `Modified ${pascalName} objects`,
            required: true,
            schema: {
                type: 'array',
                items: schemaDef.schema
            }
        }), { summary: `update multiple ${name} objects`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`updated ${name} objects`, {
                type: 'array',
                items: schemaRef
            })) });
    }
    /**
     * DELETE /<collection>/
     */
    if (includeMethod('delete')) {
        baseRoutes.path.delete = Object.assign({}, common, addScopes('write'), parameters({
            name: '_id',
            in: 'query',
            type: 'array',
            items: {
                type: 'string',
                ['x-tyranid-openapi-object-id']: true
            },
            description: `IDs of the ${pascalName} objects to delete`,
            required: true
        }), { summary: `delete multiple ${name} object`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`deletes the ${name} objects`)) });
    }
    /**
     *
     * single id routes
     *
     */
    const singleIdRoutes = {
        route: `/${baseCollectionRoute}/{_id}`,
        path: {}
    };
    out.paths.push(singleIdRoutes);
    /**
     * GET /<collection>/{_id}
     */
    if (includeMethod('get')) {
        singleIdRoutes.path.get = Object.assign({ summary: `retrieve an individual ${name} object` }, common, returns, addScopes('read'), parameters(idParameter), { responses: Object.assign({}, denied(), invalid(), tooMany(), success(`sends the ${name} object`, schemaRef)) });
    }
    /**
     * PUT /<collection>/{_id}
     */
    if (includeMethod('put')) {
        singleIdRoutes.path.put = Object.assign({}, common, returns, addScopes('write'), parameters(idParameter, {
            name: 'data',
            in: 'body',
            description: `Modified ${pascalName} object`,
            required: true,
            schema: putPostSchema
        }), { summary: `update single ${name} object`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`updated ${name} object`, schemaRef)) });
    }
    /**
     * DELETE /<collection>/{_id}
     */
    if (includeMethod('delete')) {
        singleIdRoutes.path.delete = Object.assign({}, common, addScopes('write'), parameters(idParameter), { summary: `delete an individual ${name} object`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`deletes the ${name} object`)) });
    }
    /**
     * remove any path entries that don't have any methods
     */
    out.paths = out.paths.filter(p => !!Object.keys(p.path).length);
    return out;
}
exports.path = path;
/**
 * rate limiter response
 */
function tooMany() {
    return {
        429: {
            description: 'Too many requests.'
        }
    };
}
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