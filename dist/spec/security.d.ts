import { Security } from 'swagger-schema-official';
/**
 * create security configuration given a hash of scopes
 *
 * TODO: should allow for multiple security def types
 *
 * @param host api host url
 * @param scopes hash of scopes
 */
export declare function createSecurityDefinitions(host: string, scopes: {
    [key: string]: string;
}): {
    default: {
        type: string;
        authorizationUrl: string;
        tokenUrl: string;
        flow: string;
        scopes: {
            [key: string]: string;
        };
    };
};
/**
 * Create oauth2 schemas for a given object type
 *
 * @param name name of api object
 */
export declare function collectionScopes(route: string, name: string): {
    [x: string]: string;
};
/**
 * create array of required scopes for request
 *
 * @param name api object name
 * @param scopes list of scopes to require
 */
export declare function requireScopes(...scopes: string[]): {
    security: Security[];
};
/**
 * properly format a scope
 *
 * @param collection name of collection
 * @param access name of access type (read/write)
 */
export declare function createScope(collection: string, access: 'read' | 'write'): string;
