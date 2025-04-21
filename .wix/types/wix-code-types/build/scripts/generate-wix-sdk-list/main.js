"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSdkModuleMap = exports.getWixSdkContextsFromScopes = void 0;
const wix_code_common_1 = require("@wix/wix-code-common");
const model_1 = require("../model");
const path_1 = __importDefault(require("path"));
const constants_1 = __importDefault(require("../constants"));
const utils_1 = require("../utils");
const projectRoot = path_1.default.join(__dirname, "../../");
const getWixSdkContextsFromScopes = (scopes) => {
    const targetContexts = [wix_code_common_1.FileContext.Public, wix_code_common_1.FileContext.Page];
    const isBackend = scopes.includes(wix_code_common_1.RuntimeScope.Backend);
    if (isBackend) {
        targetContexts.push(wix_code_common_1.FileContext.Backend);
    }
    return targetContexts;
};
exports.getWixSdkContextsFromScopes = getWixSdkContextsFromScopes;
const generateSdkModuleMap = () => {
    const sdkModel = (0, model_1.getWixCodeTypesSdkModel)();
    const wixSdkModules = Object.values(sdkModel.packages).reduce((acc, pkg) => {
        (0, exports.getWixSdkContextsFromScopes)(pkg.scopes).forEach((context) => {
            acc[context].push(pkg.name);
        });
        return acc;
    }, {
        [wix_code_common_1.FileContext.Page]: [],
        [wix_code_common_1.FileContext.Backend]: [],
        [wix_code_common_1.FileContext.Public]: [],
    });
    const moduleListFilePath = path_1.default.join(projectRoot, constants_1.default.DEST_JSONS_PATH, wix_code_common_1.SDK_LIST_FILENAME);
    (0, utils_1.writeModulesMapToJSON)(wixSdkModules, moduleListFilePath);
};
exports.generateSdkModuleMap = generateSdkModuleMap;
(0, exports.generateSdkModuleMap)();
//# sourceMappingURL=main.js.map