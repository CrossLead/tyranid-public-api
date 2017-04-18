import { Tyr } from 'tyranid';


type SwaggerOptions = boolean | {

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

};


/**
 * module augmentations for tyranid
 */
declare module 'tyranid' {

  namespace Tyr {

    interface CollectionDefinitionHydrated {

      /**
       * Swagger api spec generation options for collection as a whole.
       * can be boolean to add all default routes or object
       * for more granular control.
       */
      swagger?: SwaggerOptions;

    }

    interface FieldDefinition {

      /**
       * Swagger api spec generation options for specific field.
       * Can be boolean to add all default routes or object
       * for more granular control.
       */
      swagger?: SwaggerOptions;

    }

  }

}