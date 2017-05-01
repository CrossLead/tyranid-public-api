import { Spec } from 'swagger-schema-official';
import { Tyr as Tyranid } from 'tyranid';
import { Options } from '../interfaces';
/**
 * Given an instance of tyranid, create a Open API api spec
 *
 * @param Tyr initialized tyranid object
 * @param options schema generation options
 */
export declare function spec(Tyr: typeof Tyranid, opts: Options & {
    yaml: true;
}): string;
export declare function spec(Tyr: typeof Tyranid, opts?: Options & {
    yaml?: void | false;
}): Spec;
