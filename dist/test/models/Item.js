"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tyranid_1 = require("tyranid");
exports.default = new tyranid_1.Tyr.Collection({
    id: 'i01',
    name: 'item',
    dbName: 'items',
    openAPI: {
        partition: [
            {
                name: 'plan',
                partialFilterExpression: {
                    kind: 'plan'
                }
            },
            {
                name: 'task',
                partialFilterExpression: {
                    kind: 'task'
                }
            },
            {
                name: 'project',
                partialFilterExpression: {
                    kind: 'project'
                }
            }
        ]
    },
    fields: {
        _id: { is: 'mongoid' },
        organizationId: { is: 'mongoid' },
        name: { is: 'string', openAPI: true, required: true },
        kind: { is: 'string' },
        planField: {
            is: 'string',
            openAPI: {
                partition: 'plan'
            }
        },
        taskField: {
            is: 'string',
            openAPI: {
                partition: 'task'
            }
        },
        nestedPartitionField: {
            is: 'object',
            fields: {
                innerPlanOrProjectField: {
                    is: 'string',
                    openAPI: {
                        partition: ['plan', 'project'],
                        name: 'renamedPartitionField'
                    }
                },
                innerTaskField: { is: 'string', openAPI: { partition: 'task' } }
            }
        }
    }
});
//# sourceMappingURL=Item.js.map