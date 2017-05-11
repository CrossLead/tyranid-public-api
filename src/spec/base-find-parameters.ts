/**
 * query parameters for searching
 */
export default [
  {
    name: '$search',
    in: 'query',
    type: 'string',
    description: `
      Search against a text field, for example "?$search=name:ben"
      searches the "name" property for the string "ben". Nested properties
      can be specified using dot syntax (for example: "?$search=info.nested.name:ben")
    `.trim()
  },
  {
    name: '$minDate',
    in: 'query',
    type: 'string',
    description: `
      Restrict minimum date value for a date field, for example "?$minDate=date:1494522427127"
      returns matches with the "date" field having values greater
      than 1494522427127 (milliseconds since the unix epoch)
    `.trim()
  },
  {
    name: '$maxDate',
    in: 'query',
    type: 'string',
    description: `
      Restrict maximum date value for a date field, for example "?$maxDate=date:1494522427127"
      returns matches with the "date" field having values less
      than 1494522427127 (milliseconds since the unix epoch)
    `.trim()
  },
  {
    name: '$limit',
    in: 'query',
    type: 'number',
    description: `Number of results to include in response`,
    default: 10
  },
  {
    name: '$skip',
    in: 'query',
    type: 'number',
    description: `Number of results to skip in search`,
    default: 0
  },
  {
    name: '$sort',
    in: 'query',
    type: 'string',
    description: `Property to sort on`,
    default: '_id'
  },
  {
    name: '$ascend',
    in: 'query',
    type: 'boolean',
    description: `Ascending sort`,
    default: false
  }
];
