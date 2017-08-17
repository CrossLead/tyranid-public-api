"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * create security configuration given a hash of scopes
 *
 * TODO: should allow for multiple security def types
 *
 * @param host api host url
 * @param scopes hash of scopes
 */
function createSecurityDefinitions(host, scopes) {
    return {
        default: {
            type: 'oauth2',
            authorizationUrl: `${host}/oauth2/authorize`,
            tokenUrl: `${host}/oauth2/token`,
            flow: 'accessCode',
            scopes
        }
    };
}
exports.createSecurityDefinitions = createSecurityDefinitions;
/**
 * Create oauth2 schemas for a given object type
 *
 * @param name name of api object
 */
function collectionScopes(route, name) {
    return {
        [createScope(route, 'read')]: `Read access to ${name} objects`,
        [createScope(route, 'write')]: `Write access to ${name} objects`
    };
}
exports.collectionScopes = collectionScopes;
/**
 * create array of required scopes for request
 *
 * @param name api object name
 * @param scopes list of scopes to require
 */
function requireScopes(...scopes) {
    // TODO: fix typings
    /* tslint:disable */
    return {
        security: [{ default: scopes }]
    };
    /* tslint:enable */
}
exports.requireScopes = requireScopes;
/**
 * properly format a scope
 *
 * @param collection name of collection
 * @param access name of access type (read/write)
 */
function createScope(collection, access) {
    return `${access}:${collection}`;
}
exports.createScope = createScope;
//# sourceMappingURL=security.js.map