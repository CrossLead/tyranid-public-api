import { Parameter, Path, Schema } from 'swagger-schema-official';

export interface SchemaOptions {
  /**
   * description to use instead of the main field note
   */
  note?: string;

  /**
   * custom name for field / collection
   */
  name?: string;
}

export interface FieldSchemaOptions extends SchemaOptions {
  /**
   * property should be returned / accepted by api
   */
  include?: 'read' | 'write';
}

export interface CollectionSchemaOptions extends SchemaOptions {
  /**
   * methods to generate for this collection
   */
  methods?: ('get' | 'post' | 'put' | 'delete')[];

  /**
   * whether this collection should be a
   * child route of another (linked) collection
   */
  parent?: string;

  /**
   * use parent scope for security (don't generate custom scope for this collection)
   */
  useParentScope?: true;
}

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
