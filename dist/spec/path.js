"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const baseParameters = require("./base-find-parameters");
const security_1 = require("./security");
const MAX_ARRAY_ITEMS = 200;
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
    const pluralize = (str) => str.endsWith('s') ? str : str + 's';
    const schemaDef = lookup[def.id];
    const baseCollectionName = pluralize(schemaDef.name);
    const baseRouteParameters = [];
    const { pascalName, schema } = schemaDef;
    const cloneSchema = () => JSON.parse(JSON.stringify(schemaDef.schema));
    const putSchema = cloneSchema();
    const postSchema = cloneSchema();
    putSchema.properties = makeOptional(filterNotReadOnly(putSchema.properties || {}));
    putSchema.properties._id = schemaDef.schema.properties._id;
    putSchema.required = ['_id'];
    postSchema.properties = filterNotReadOnly(postSchema.properties || {});
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
        /**
         * remove parent link id from post schema
         */
        delete putSchema.properties[parentField.name];
        delete postSchema.properties[parentField.name];
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
    if (!schemaDef) {
        return utils_1.error(`
      No schema definition found for collection id = ${def.id}
    `);
    }
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
        const filteredSchema = filterSchemaForMethod('get', schemaDef.schema);
        if (!filteredSchema)
            throw new Error(`No schema for get after filtering`);
        baseRoutes.path.get = Object.assign({}, common, returns, parameters(...baseParameters.DEFAULT_PARAMETERS), addScopes('read'), { summary: `retrieve multiple ${pascalName} objects`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`array of ${pascalName} objects`, {
                type: 'array',
                maxItems: MAX_ARRAY_ITEMS,
                items: filteredSchema
            }, {
                paging: {
                    type: 'object',
                    description: 'Parameter settings for next page of results',
                    properties: (() => {
                        const props = {
                            $limit: utils_1.pick(baseParameters.LIMIT, ['type', 'description', 'default']),
                            $skip: utils_1.pick(baseParameters.SKIP, ['type', 'description', 'default']),
                            $sort: utils_1.pick(baseParameters.SORT, ['type', 'description', 'default'])
                        };
                        props.$skip.default = props.$limit.default;
                        return props;
                    })()
                }
            })) });
    }
    /**
     * POST /<collection>/
     */
    if (includeMethod('post')) {
        const filteredBodySchema = filterSchemaForMethod('post', postSchema);
        if (!filteredBodySchema)
            throw new Error(`No schema for post after filtering`);
        const filteredResponseSchema = filterSchemaForMethod('post', schemaDef.schema);
        if (!filteredResponseSchema)
            throw new Error(`No schema for post after filtering`);
        baseRoutes.path.post = Object.assign({}, common, returns, addScopes('write'), parameters({
            name: 'data',
            in: 'body',
            description: `Array of new ${pascalName} objects`,
            required: true,
            schema: {
                type: 'array',
                maxItems: MAX_ARRAY_ITEMS,
                items: filteredBodySchema
            }
        }), { summary: `create new ${pascalName} objects`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`created ${pascalName} objects`, {
                type: 'array',
                maxItems: MAX_ARRAY_ITEMS,
                items: filteredResponseSchema
            })) });
    }
    /**
     * PUT /<collection>/
     */
    if (includeMethod('put')) {
        const filteredBodySchema = filterSchemaForMethod('put', putSchema);
        if (!filteredBodySchema)
            throw new Error(`No schema for put after filtering`);
        const filteredResponseSchema = filterSchemaForMethod('put', schemaDef.schema);
        if (!filteredResponseSchema)
            throw new Error(`No schema for put after filtering`);
        baseRoutes.path.put = Object.assign({}, common, returns, addScopes('write'), parameters({
            name: 'data',
            in: 'body',
            description: `Modified ${pascalName} objects`,
            required: true,
            schema: {
                type: 'array',
                maxItems: MAX_ARRAY_ITEMS,
                items: filteredBodySchema
            }
        }), { summary: `update multiple ${pascalName} objects`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`updated ${pascalName} objects`, {
                type: 'array',
                maxItems: MAX_ARRAY_ITEMS,
                items: filteredResponseSchema
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
            maxItems: MAX_ARRAY_ITEMS,
            items: {
                type: 'string',
                ['x-tyranid-openapi-object-id']: true
            },
            description: `IDs of the ${pascalName} objects to delete`,
            required: true
        }), { summary: `delete multiple ${pascalName} object`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`deletes the ${pascalName} objects`)) });
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
        singleIdRoutes.path.get = Object.assign({ summary: `retrieve an individual ${pascalName} object` }, common, returns, addScopes('read'), parameters(idParameter), { responses: Object.assign({}, denied(), invalid(), tooMany(), success(`sends the ${pascalName} object`, schemaRef)) });
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
            schema: putSchema
        }), { summary: `update single ${pascalName} object`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`updated ${pascalName} object`, schemaRef)) });
    }
    /**
     * DELETE /<collection>/{_id}
     */
    if (includeMethod('delete')) {
        singleIdRoutes.path.delete = Object.assign({}, common, addScopes('write'), parameters(idParameter), { summary: `delete an individual ${pascalName} object`, responses: Object.assign({}, denied(), invalid(), tooMany(), success(`deletes the ${pascalName} object`)) });
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
            description: 'too many requests',
            schema: {
                type: 'object',
                properties: {
                    status: { type: 'number' },
                    message: { type: 'string' }
                }
            }
        }
    };
}
/**
 * create a 403 response
 *
 * @param description message for denial
 */
function denied(description = 'permission denied') {
    return {
        403: {
            description,
            schema: {
                type: 'object',
                properties: {
                    status: { type: 'number' },
                    message: { type: 'string' }
                }
            }
        }
    };
}
/**
 * create a 200 response
 * @param description success message
 * @param schema [optional] schema of response body
 */
function success(description, schema, meta = {}) {
    return {
        200: {
            description,
            schema: {
                type: 'object',
                properties: Object.assign({ status: { type: 'number' }, message: { type: 'string' } }, meta, (schema ? { data: schema } : {}))
            }
        }
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
            description,
            schema: {
                type: 'object',
                properties: {
                    status: { type: 'number' },
                    message: { type: 'string' }
                }
            }
        }
    };
}
/**
 * Return properties filtered by not readonly
 *
 * @param schemaHash properties field of a schema
 */
function filterNotReadOnly(schemaHash) {
    const keys = Object.keys(schemaHash);
    const out = {};
    for (const key of keys) {
        if (!schemaHash[key].readOnly) {
            out[key] = Object.assign({}, schemaHash[key]);
            const props = schemaHash[key].properties;
            const items = schemaHash[key].items;
            if (props) {
                out[key].properties = filterNotReadOnly(props);
            }
            if (items) {
                const { filteredItems } = filterNotReadOnly({ filteredItems: items });
                out[key].items = filteredItems;
            }
        }
    }
    return out;
}
/**
 * Make all properties in schema optional
 *
 * @param schemaHash properties field of a schema
 */
function makeOptional(schemaHash) {
    const keys = Object.keys(schemaHash);
    const out = {};
    for (const key of keys) {
        out[key] = Object.assign({}, schemaHash[key]);
        delete out[key].required;
        const props = schemaHash[key].properties;
        const items = schemaHash[key].items;
        if (props) {
            out[key].properties = makeOptional(props);
        }
        if (items) {
            const { filteredItems } = makeOptional({ filteredItems: items });
            out[key].items = filteredItems;
        }
    }
    return out;
}
/**
 * Filter schema to include properties for specific methods, if listed
 *
 * @param method HTTP verb
 * @param schema schema with possible method metadata
 */
function filterSchemaForMethod(method, schema) {
    if (!includePropertyForMethod(method, schema))
        return;
    switch (schema.type) {
        case 'array': {
            const filtered = filterSchemaForMethod(method, schema.items);
            if (filtered) {
                const updated = Object.assign({}, schema, { items: filtered });
                return updated;
            }
            return;
        }
        case 'object': {
            const out = Object.assign({}, schema, { properties: {} });
            utils_1.each(schema.properties, (prop, name) => {
                const result = filterSchemaForMethod(method, prop);
                if (result) {
                    out.properties[name] = result;
                }
            });
            if (Array.isArray(out.required)) {
                out.required = out.required.filter(p => p in out.properties);
            }
            return out;
        }
        default: return schema;
    }
}
/**
 * Check if a swagger schema has method metadata
 *
 * @param method HTTP verb
 * @param schema extended schema to check for methods metadata
 */
function includePropertyForMethod(method, schema) {
    const methods = schema['x-tyranid-openapi-methods'];
    return !methods || (methods.indexOf(method) !== -1);
}
//# sourceMappingURL=path.js.map