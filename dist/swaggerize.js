"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./express/");
const _2 = require("./spec/");
/**
 * generate api spec and handlers for swaggerize-express
 *
 *
 * @param Tyr tyranid instance
 * @param opts configuration
 */
function createSwaggerizeConfig(Tyr, opts) {
    const api = _2.spec(Tyr, opts);
    const routeHandlers = _1.handlers(Tyr, api);
    return {
        api,
        docspath: '/docs',
        handlers: routeHandlers
    };
}
exports.createSwaggerizeConfig = createSwaggerizeConfig;
//# sourceMappingURL=swaggerize.js.map