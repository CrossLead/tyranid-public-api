import { Tyr as Tyranid } from 'tyranid';

export interface TyranidSwaggerOptions {
  /**
   * api version, defaults to 1
   */
  version: number;
}



/**
 * Given an instance of tyranid, create a swagger api spec
 *
 * @param Tyr initialized tyranid object
 * @param options schema generation options
 */
export async function generate(
  Tyr: typeof Tyranid,
  options?: TyranidSwaggerOptions
) {

  return '';
}