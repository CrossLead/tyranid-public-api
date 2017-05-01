/// <reference types="express" />
import { Handler } from 'express';
import { Spec } from 'swagger-schema-official';
import { Tyr as Tyranid } from 'tyranid';
export interface ExpressHandlerHash {
    [key: string]: ExpressHandlerHash | Handler;
}
/**
 * Generate handlers for
 */
export declare function handlers(Tyr: typeof Tyranid, api: Spec): ExpressHandlerHash;
