declare var _default: {
    ErrorInvalidRequest: {
        type: string;
        properties: {
            status: {
                type: string;
                enum: number[];
            };
            message: {
                type: string;
            };
        };
    };
    ErrorInternalServer: {
        type: string;
        properties: {
            status: {
                type: string;
                enum: number[];
            };
            message: {
                type: string;
            };
        };
    };
    ErrorPermissionDenied: {
        type: string;
        properties: {
            status: {
                type: string;
                enum: number[];
            };
            message: {
                type: string;
            };
        };
    };
    ErrorTooManyRequests: {
        type: string;
        properties: {
            status: {
                type: string;
                enum: number[];
            };
            message: {
                type: string;
            };
        };
    };
};
export default _default;
