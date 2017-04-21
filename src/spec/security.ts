import { Security } from 'swagger-schema-official';

export type AuthScope = 'read' | 'write';

/**
 * create security configuration given a hash of scopes
 *
 * @param scopes hash of scopes
 */
export function createSecurityDefinitions(scopes: { [key: string]: string }) {
  return {
    oauth2: {
      type: "oauth2",
      authorizationUrl: "http://api.example.com/api/auth/",
      tokenUrl: "http://api.example.com/api/token/",
      flow: "accessCode",
      scopes
    }
  };
}

/**
 * Create oauth2 schemas for a given object type
 *
 * @param name name of api object
 */
export function collectionScopes(name: string) {
  return {
    [`read:${name}`]: `Read access to ${name} objects`,
    [`write:${name}`]: `Write access to ${name} objects`
  };
}

/**
 * create array of required scopes for request
 *
 * @param name api object name
 * @param scopes list of scopes to require
 */
export function requireScopes(name: string, scopes: AuthScope | AuthScope[]) {
  scopes = Array.isArray(scopes) ? scopes : [ scopes ];

  // TODO: fix typings
  /* tslint:disable */
  return {
    security: (
      scopes.map(scope => {
        return { oauth2: [`${scope}:${name}`] }
      }) as any
    ) as Security[]
  };
  /* tslint:enable */
}
