import { Path, Schema } from 'swagger-schema-official';


/**
 * Swagger options listed in tyranid schema annotations
 */
export type SchemaOptions = boolean | {

  /**
   * methods to generate for this field
   */
  methods?: Array<'get' | 'post' | 'put' | 'delete'>;

  /**
   * description to use instead of the main field note
   */
  note?: string;

  /**
   * scopes required for this field
   */
  scopes?: string[];

  /**
   * custom route name for collection
   */
  route?: string;
};


/**
 * container object for a generated swagger path
 */
export interface PathContainer {
  id: string;
  paths: {
    route: string,
    path: Path;
  }[];
}


/**
 * container object for a generated swagger schema
 */
export interface SchemaContainer {
  name: string;
  id: string;
  schema: Schema;
}


/**
 * additional properties on tyranid schema
 * used by tyranid-swagger
 */
export interface SchemaAnnotation {
  /**
   * expose property to public api
   */
  public?: boolean;
}
