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
    /**
     * create Open API object schemas for relevant collections / properties
     */
    const specList = collections.reduce((out, col) => {
        const virtualList = getIndividualOpts(col).map(individualOpts => {
            const result = schema_1.schema(col.def, individualOpts);
            return {
                name: result.pascalName,
                result,
                schema: result.schema
            };
        });
        return [...virtualList, ...out];
    }, []);
    /**
     * sort results by public name
     */
    specList.sort(sortByName);
    specList.forEach(item => {
        const { result, name, schema } = item;
        lookup[result.id] = result;
        specObject.definitions[name] = schema;
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
    const pathItems = collections.reduce((out, col) => {
        getIndividualOpts(col).forEach(indOpts => {
            const result = path_1.path(col.def, indOpts, lookup);
            const paths = result.paths;
            out.paths.push({ paths, name: utils_1.pascal(indOpts.name || col.def.name) });
            if (!indOpts.parent || !indOpts.useParentScope) {
                out.scopes.push(security_1.collectionScopes(result.base, lookup[result.id].name));
            }
        });
        return out;
    }, { paths: [], scopes: [] });
    const { paths: pathsToAdd, scopes: scopesToAdd } = pathItems;
    // sort paths by public name
    pathsToAdd.sort(sortByName);
    pathsToAdd.forEach(item => {
        const { paths } = item;
        for (const p of paths) {
            specObject.paths[p.route] = p.path;
        }
    });
    scopesToAdd.forEach(scopes => {
        // add scopes for this collection
        Object.assign(oauth2Scopes, scopes);
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
/**
 * get all virtual collection specs from a tyranid collection
 *
 * @param col tyranid collection
 */
function getIndividualOpts(col) {
    const colOpts = utils_1.options(col.def);
    if (isPartitionedOptions(colOpts)) {
        const optList = colOpts.partition;
        // validate that all partitions have a restriction query
        optList.forEach(partition => {
            if (!partition.name) {
                throw new Error(`Partition has no name: ${JSON.stringify(partition, null, 2)}`);
            }
            if (!partition.partialFilterExpression) {
                throw new Error(`Partition has no partialFilterExpression: ${JSON.stringify(partition, null, 2)}`);
            }
        });
        return optList;
    }
    else {
        return [colOpts];
    }
}
/**
 * Detect whether or not options from a schema contain a partition
 *
 * @param opts tyranid schema options for openapi
 */
function isPartitionedOptions(opts) {
    return !!opts.partition;
}
function sortByName(a, b) {
    const A = a.name;
    const B = b.name;
    return Number(A > B) - Number(A < B);
}
//# sourceMappingURL=spec.js.map