"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * error response schema
 */
exports.default = {
    ErrorInvalidRequest: {
        type: 'object',
        properties: {
            status: { type: 'number', enum: [400] },
            message: { type: 'string' }
        }
    },
    ErrorInternalServer: {
        type: 'object',
        properties: {
            status: { type: 'number', enum: [500] },
            message: { type: 'string' }
        }
    },
    ErrorPermissionDenied: {
        type: 'object',
        properties: {
            status: { type: 'number', enum: [403] },
            message: { type: 'string' }
        }
    },
    ErrorTooManyRequests: {
        type: 'object',
        properties: {
            status: { type: 'number', enum: [429] },
            message: { type: 'string' }
        }
    }
};
//# sourceMappingURL=error-schema.js.map