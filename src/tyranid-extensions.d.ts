import { Tyr } from 'tyranid';
import { SchemaOptions } from './spec';

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
      swagger?: SchemaOptions;

    }

    interface FieldDefinition {

      /**
       * Swagger api spec generation options for specific field.
       * Can be boolean to add all default routes or object
       * for more granular control.
       */
      swagger?: SchemaOptions;

    }

  }

}
