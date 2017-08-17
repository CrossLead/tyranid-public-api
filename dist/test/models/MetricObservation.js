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
        metricId: { link: 'metric', openAPI: true },
        organizationId: { is: 'mongoid' },
        date: { is: 'date', openAPI: true },
        value: { is: 'double', openAPI: true }
    }
});
//# sourceMappingURL=MetricObservation.js.map