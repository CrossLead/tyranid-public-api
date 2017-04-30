import { Spec } from 'swagger-schema-official';
import { Tyr as Tyranid } from 'tyranid';
import { ExpressHandlerHash, handlers } from './express/';
import { Options } from './interfaces';
import { spec } from './spec/' ;

/**
 * generate api spec and handlers for swaggerize-express
 *
 *
 * @param Tyr tyranid instance
 * @param opts configuration
 */
export function createSwaggerizeConfig(
  Tyr: typeof Tyranid,
  opts: Options & { yaml?: false }
) {

  const api = spec(Tyr, opts);
  const routeHandlers = handlers(Tyr, api);

  return {
    api,
    docspath: '/docs',
    handlers: routeHandlers
  };
}
