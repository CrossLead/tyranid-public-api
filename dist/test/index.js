"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const path_1 = require("path");
const tyranid_1 = require("tyranid");
const _1 = require("../");
/**
 * boot tyranid without db
 */
ava_1.default.before((t) => __awaiter(this, void 0, void 0, function* () {
    yield tyranid_1.Tyr.config({
        validate: [
            { glob: path_1.join(__dirname, './models/*.js') },
        ],
    });
    t.truthy(tyranid_1.Tyr.collections.length);
}));
ava_1.default('pascalCase should return correct values', (t) => {
    t.is(_1.pascal('my short sentence'), 'MyShortSentence');
    t.is(_1.pascal('my_snake_sentence'), 'MySnakeSentence');
});
ava_1.default('should generate correct definition from schema', (t) => __awaiter(this, void 0, void 0, function* () {
    const s = _1.schema(tyranid_1.Tyr.byName.metric.def);
    t.deepEqual(s.pascalName, 'Metric');
}));
ava_1.default('should generate spec that passes validation', (t) => __awaiter(this, void 0, void 0, function* () {
    const s = _1.spec(tyranid_1.Tyr);
    /* tslint:disable */
    require('fs').writeFileSync('./.tmp/test-spec.yaml', _1.yaml(s));
    /* tslint:enable */
    t.pass();
}));
//# sourceMappingURL=index.js.map