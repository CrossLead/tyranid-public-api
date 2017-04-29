import { Tyr } from 'tyranid';

/**
 * enum of types of possible spreadsheet data mappings
 */
export const SpreadsheetTemplateMappingType = new Tyr.Collection({
  id: 'stt',
  name: 'spreadsheetTemplateMappingType',
  enum: true,
  openAPI: {
    name: 'type',
    route: 'users/{userId}/type',
    routeParams: [{
      name: 'userId',
      in: 'path',
      type: 'string',
      description: 'User owning this',
      required: true
    }]
  },
  fields: { _id: { is: 'integer' }, name: { is: 'string', labelField: true } },
  values: [['_id', 'name'], [0, 'None'], [1, 'Tabular'], [2, 'Cell']],
});
