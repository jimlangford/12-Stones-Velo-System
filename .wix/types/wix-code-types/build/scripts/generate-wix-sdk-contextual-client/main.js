"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWixSdkTypesToContextualClient = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const constants_1 = __importDefault(require("../constants"));
const rollup_1 = require("rollup");
const rollup_plugin_dts_1 = __importDefault(require("rollup-plugin-dts"));
const addWixSdkTypesToContextualClient = () => __awaiter(void 0, void 0, void 0, function* () {
    const wixSdkContextualClientDtsPath = path_1.default.join(constants_1.default.TYPES_COMMON_PATH, constants_1.default.WIX_SDK_CONTEXTUAL_CLIENT_FILENAME);
    const bundle = yield (0, rollup_1.rollup)({
        input: wixSdkContextualClientDtsPath,
        plugins: [(0, rollup_plugin_dts_1.default)({ respectExternal: true })],
        onwarn: e => {
            throw new Error(`Failed bundling ${constants_1.default.WIX_SDK_CONTEXTUAL_CLIENT_FILENAME}: ${e === null || e === void 0 ? void 0 : e.message}`);
        },
    });
    const { output } = yield bundle.generate({ format: "es" });
    if (output.length === 0) {
        throw new Error(`Failed bundling ${constants_1.default.WIX_SDK_CONTEXTUAL_CLIENT_FILENAME}`);
    }
    const generatedCode = output[0].code;
    fs_extra_1.default.writeFileSync(wixSdkContextualClientDtsPath, generatedCode, 'utf8');
});
exports.addWixSdkTypesToContextualClient = addWixSdkTypesToContextualClient;
if (require.main === module) {
    (0, exports.addWixSdkTypesToContextualClient)();
}
//# sourceMappingURL=main.js.map