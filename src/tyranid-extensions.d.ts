import { Tyr } from 'tyranid';


/**
 * module augmentations for tyranid
 */
declare module 'tyranid' {

  namespace Tyr {

    interface FieldDefinition {

      /**
       * swagger api spec generation options for specific field,
       * can be boolean to add all default routes or object
       * for more granular control
       */
      swagger?: boolean | {

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

      }

    }

  }

}