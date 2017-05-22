"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tyranid_1 = require("tyranid");
const TargetType = new tyranid_1.Tyr.Collection({
    id: 'mtt',
    name: 'metricTargetType',
    enum: true,
    fields: {
        _id: { is: 'integer' },
        name: { is: 'string', labelField: true }
    },
    values: [
        ['_id', 'name'],
        [1, 'Value'],
        [2, 'Metric']
    ]
});
exports.default = new tyranid_1.Tyr.Collection({
    id: 'mtg',
    name: 'metricTarget',
    dbName: 'metricTargets',
    openAPI: {
        parent: 'metric',
        useParentScope: true
    },
    fields: {
        _id: { is: 'mongoid' },
        metricId: { link: 'metric', openAPI: true },
        date: { is: 'date', openAPI: true },
        value: { is: 'double', openAPI: true },
        organizationId: { is: 'mongoid' },
        excludeProperty: { is: 'string' },
        type: {
            link: 'metricTargetType', openAPI: true
        }
    },
});
//# sourceMappingURL=MetricTarget.js.map