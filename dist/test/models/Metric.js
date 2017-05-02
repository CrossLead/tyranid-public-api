"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tyranid_1 = require("tyranid");
exports.default = new tyranid_1.Tyr.Collection({
    id: 't01',
    name: 'metric',
    dbName: 'metrics',
    openAPI: true,
    fields: {
        _id: { is: 'mongoid' },
        organizationId: { is: 'mongoid' },
        name: { is: 'string' }
    },
});
//# sourceMappingURL=Metric.js.map