import { Spec } from 'swagger-schema-official';
import { Tyr as Tyranid } from 'tyranid';
import { ExpressHandlerHash } from './express/';
import { Options } from './interfaces';
/**
 * generate api spec and handlers for swaggerize-express
 *
 *
 * @param Tyr tyranid instance
 * @param opts configuration
 */
export declare function createSwaggerizeConfig(Tyr: typeof Tyranid, opts: Options & {
    yaml?: false;
}): {
    api: Spec;
    docspath: string;
    handlers: ExpressHandlerHash;
};
