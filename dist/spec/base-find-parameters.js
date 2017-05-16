"use strict";
/**
 * query parameters for searching
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEARCH_STRING = {
    name: '$search',
    in: 'query',
    type: 'string',
    description: `
Search against a text field.

For example \`?$search=name:ben\`
searches the \`name\` property for the string \`ben\`. Nested properties
can be specified using dot syntax (for example: \`?$search=info.nested.name:ben\`)
  `.trim()
};
exports.MIN_DATE = {
    name: '$minDate',
    in: 'query',
    type: 'string',
    description: `
Restrict minimum date value for a date field.


For example \`?$minDate=date:1494522427127\`
returns matches with the \`date\` field having values greater
than 1494522427127 (milliseconds since the unix epoch)
  `
};
exports.MAX_DATE = {
    name: '$maxDate',
    in: 'query',
    type: 'string',
    description: `
Restrict maximum date value for a date field.

For example \`?$maxDate=date:1494522427127\`
returns matches with the "date" field having values less
than 1494522427127 (milliseconds since the unix epoch)
  `
};
exports.LIMIT = {
    name: '$limit',
    in: 'query',
    type: 'number',
    description: `Number of results to include in response`,
    default: 10
};
exports.SKIP = {
    name: '$skip',
    in: 'query',
    type: 'number',
    description: `Number of results to skip in search`,
    default: 0
};
exports.SORT = {
    name: '$sort',
    in: 'query',
    type: 'string',
    description: `Property to sort on`,
    default: '_id'
};
exports.ASCEND = {
    name: '$ascend',
    in: 'query',
    type: 'boolean',
    description: `Ascending sort`,
    default: false
};
exports.DEFAULT_PARAMETERS = [
    exports.SEARCH_STRING,
    exports.MIN_DATE,
    exports.MAX_DATE,
    exports.LIMIT,
    exports.SKIP,
    exports.SORT,
    exports.ASCEND
];
//# sourceMappingURL=base-find-parameters.js.map