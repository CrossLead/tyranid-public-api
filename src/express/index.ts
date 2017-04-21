import * as expressApplication from 'express';
import { Spec } from 'swagger-schema-official';
import * as swaggerize from 'swaggerize-express';
import { Tyr as Tyranid } from 'tyranid';
import { ExpressOptions } from '../interfaces';

/**
 * generate express app from swagger spec (or tyranid instance)
 *
 * @param api openAPI specification object
 * @param options configuration, must include docsPath and handlerPath
 */
export function express(
  api: Spec,
  options: ExpressOptions
): expressApplication.Application {
  const app = expressApplication();

  // TODO: if https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16046
  // is resolved, fix any cast
  const publicApiHandler = swaggerize({
    /* tslint:disable */
    api: ((api as any) as swaggerize.Swagger.ApiDefinition),
    /* tslint:enable */
    docspath: options.docsPath,
    handlers: options.handlerPath
  });

  /**
   * use public api handler here
   */
  app.use(publicApiHandler);

  /**
   * add oauth2 token generation routes
   */

  return app;
}
