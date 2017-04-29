import { Security } from 'swagger-schema-official';

export type AuthScope = 'read' | 'write';

/**
 * create security configuration given a hash of scopes
 *
 * @param host api host url
 * @param scopes hash of scopes
 */
export function createSecurityDefinitions(host: string, scopes: { [key: string]: string }) {
  return {
    oauth2: {
      type: "oauth2",
      authorizationUrl: `${host}/oauth2/authorize`,
      tokenUrl: `${host}/oauth2/token`,
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
export function collectionScopes(route: string, name: string) {
  return {
    [`read:${route}`]: `Read access to ${name} objects`,
    [`write:${route}`]: `Write access to ${name} objects`
  };
}

/**
 * create array of required scopes for request
 *
 * @param name api object name
 * @param scopes list of scopes to require
 */
export function requireScopes(route: string, scopes: AuthScope | AuthScope[]) {
  scopes = Array.isArray(scopes) ? scopes : [ scopes ];

  // TODO: fix typings
  /* tslint:disable */
  return {
    security: (
      scopes.map(scope => {
        return { oauth2: [`${scope}:${route}`] }
      }) as any
    ) as Security[]
  };
  /* tslint:enable */
}
