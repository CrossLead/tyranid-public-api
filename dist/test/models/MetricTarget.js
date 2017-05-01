"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tyranid_1 = require("tyranid");
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
        excludeProperty: { is: 'string' }
    },
});
//# sourceMappingURL=MetricTarget.js.map