"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function isHandler(obj) {
    return typeof obj === 'function';
}
/**
 * Generate handlers for
 */
function handlers(Tyr, api) {
    const out = {};
    const methods = ['get', 'post', 'put', 'delete'];
    /**
     * given swagger Path objects,
     * construct express handlers in a format
     * consumable by swaggerize-express
     */
    utils_1.each(api.paths, (path, name) => {
        const parts = name.split('/');
        parts.shift(); // remove empty string for first '/'
        let ref = out;
        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                const routes = ref[part] = ref[part] || {};
                if (isHandler(routes))
                    return utils_1.error(`handler exists at: ${part} in ${path}`);
                return methods.forEach(method => {
                    if (!path[method])
                        return;
                    routes['$' + method] = (req, res, next) => {
                        console.log(`In handler for route = ${name}, method = ${method}`);
                        return res.json({
                            message: 'ok'
                        });
                    };
                });
            }
            const next = ref[part] = ref[part] || {};
            if (isHandler(next))
                return utils_1.error(`handler exists at: ${part} in ${path}`);
            ref = next;
        });
    });
    return out;
}
exports.handlers = handlers;
//# sourceMappingURL=handlers.js.map