"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonDeprecatedModules = exports.getWixCodeTypesSdkModel = exports.getWixCodeTypesModel = void 0;
const model_json_1 = __importDefault(require("../model.json"));
const model_sdk_json_1 = __importDefault(require("../model.sdk.json"));
const utils_1 = require("./utils");
const getWixCodeTypesModel = () => {
    return model_json_1.default;
};
exports.getWixCodeTypesModel = getWixCodeTypesModel;
const getWixCodeTypesSdkModel = () => {
    return model_sdk_json_1.default;
};
exports.getWixCodeTypesSdkModel = getWixCodeTypesSdkModel;
const getNonDeprecatedModules = () => {
    const wixCodeTypesModel = (0, exports.getWixCodeTypesModel)();
    return Object.values(wixCodeTypesModel.packages)
        .filter(pkg => pkg.deprecated === false)
        .map(pkg => (0, utils_1.removeWixNamespaceFromPackage)(pkg.name));
};
exports.getNonDeprecatedModules = getNonDeprecatedModules;
exports.default = {
    getWixCodeTypesModel: exports.getWixCodeTypesModel,
    getWixCodeTypesSdkModel: exports.getWixCodeTypesSdkModel,
    getNonDeprecatedModules: exports.getNonDeprecatedModules,
};
//# sourceMappingURL=model.js.map