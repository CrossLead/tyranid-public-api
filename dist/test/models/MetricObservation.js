"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tyranid_1 = require("tyranid");
exports.default = new tyranid_1.Tyr.Collection({
    id: 'mto',
    name: 'metricObservation',
    dbName: 'metricObservations',
    openAPI: {
        parent: 'metric',
        useParentScope: true
    },
    fields: {
        _id: { is: 'mongoid' },
        metricId: { link: 'metric' },
        organizationId: { is: 'mongoid' },
        date: { is: 'date' },
        value: { is: 'double' }
    },
});
//# sourceMappingURL=MetricObservation.js.map