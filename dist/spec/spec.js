"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const error_schema_1 = require("./error-schema");
const path_1 = require("./path");
const schema_1 = require("./schema");
const security_1 = require("./security");
function spec(Tyr, opts = {}) {
    const { version = '1.0.0', description = 'Public API generated from tyranid-open-api-spec', title = 'Public API', host = 'localhost:9000', basePath = '/', schemes = ['https'] } = opts;
    const oauth2Scopes = {};
    const specObject = {
        swagger: '2.0',
        info: {
            description,
            title,
            version
        },
        basePath,
        schemes,
        host,
        paths: {},
        definitions: {}
    };
    const lookup = {};
    const collections = Tyr.collections.filter(c => c.def.openAPI);
    collections.sort((a, b) => {
        const A = utils_1.options(a.def).name || a.def.name;
        const B = utils_1.options(b.def).name || b.def.name;
        return Number(A > B) - Number(A < B);
    });
    /**
     * create Open API object schemas for relevant collections / properties
     */
    collections.forEach(col => {
        const result = schema_1.schema(col.def);
        lookup[result.id] = result;
        specObject.definitions[result.pascalName] = result.schema;
    });
    /**
     * add error refs
     */
    utils_1.each(error_schema_1.default, (schema, name) => {
        specObject.definitions[name] = schema;
    });
    /**
     * create routes referencing relevant schema
     */
    collections.forEach(col => {
        const result = path_1.path(col.def, lookup);
        const paths = result.paths;
        for (const p of paths) {
            specObject.paths[p.route] = p.path;
        }
        const colOpts = utils_1.options(col.def);
        if (!colOpts.parent || !colOpts.useParentScope) {
            // add scopes for this collection
            Object.assign(oauth2Scopes, security_1.collectionScopes(result.base, lookup[result.id].name));
        }
    });
    const [scheme] = schemes;
    Object.assign(specObject, {
        securityDefinitions: security_1.createSecurityDefinitions(scheme + '://' + host, oauth2Scopes)
    });
    const result = utils_1.validate(specObject);
    /**
     * validate schema before returning
     */
    if (!result.valid) {
        console.log(result.errors);
        return utils_1.error(`
      generated schema is invalid, inspect schema annotations for problems
      or file an issue at https://github.com/CrossLead/tyranid-openapi/issues
    `);
    }
    return opts.yaml ? utils_1.yaml(specObject) : specObject;
}
exports.spec = spec;
//# sourceMappingURL=spec.js.map