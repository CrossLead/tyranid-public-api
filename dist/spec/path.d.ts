import { Tyr } from 'tyranid';
import { PathContainer, SchemaContainer } from '../interfaces';
/**
 * Given a tyranid schema, produce an object path
 * to insert into the Open API spec.
 *
 * @param def a tyranid collection schema definition object
 */
export declare function path(def: Tyr.CollectionDefinitionHydrated, lookup: {
    [key: string]: SchemaContainer;
}): PathContainer;
