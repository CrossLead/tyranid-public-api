import { Tyr as Tyranid } from 'tyranid';


export default generate;


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
async function generate(
  Tyr: typeof Tyranid,
  options?: TyranidSwaggerOptions
) {

  return '';
}