import { Parameter, Path, Schema } from 'swagger-schema-official';

/**
 * Open API options listed in tyranid schema annotations
 */
export type SchemaOptions = boolean | {
  /**
   * methods to generate for this field
   */
  methods?: ('get' | 'post' | 'put' | 'delete')[];
  /**
   * description to use instead of the main field note
   */
  note?: string;
  /**
   * scopes required for this field
   */
  scopes?: string[];
  /**
   * custom name for collection
   */
  name?: string;
  /**
   * whether this collection should be a
   * child route of another (linked) collection
   *
   * the property containing the id linking to the parent
   * should be passed as this property.
   */
  childOf?: string;
};

/**
 * container object for a generated Open API path
 */
export interface PathContainer {
  id: string;
  base: string;
  paths: {
    route: string,
    path: Path;
  }[];
}

/**
 * container object for a generated Open API schema
 */
export interface SchemaContainer {
  name: string;
  pascalName: string;
  id: string;
  schema: Schema;
}

/**
 * additional properties on tyranid schema
 * used by tyranid-Open API
 */
export interface SchemaAnnotation {
  /**
   * expose property to public api
   */
  public?: boolean;
}

/**
 * options for spec generation
 */
export interface Options {
  /**
   * api version, defaults to 1
   */
  version?: string;
  /**
   * description of public api
   */
  description?: string;
  /**
   * title of public api
   */
  title?: string;
  /**
   * return yaml string
   */
  yaml?: boolean;
  /**
   * terms of service for the api
   */
  termsOfService?: string;
  /**
   * api host base url (defaults to http://localhost:9000)
   */
  host?: string;
  /**
   * contact information for api
   */
  contact?: {
    email: string;
    url: string;
    name: string;
  };
}

/**
 * options for express app generation
 */
export interface ExpressOptions extends Options {
  handlerPath: string;
  docsPath: string;
}
