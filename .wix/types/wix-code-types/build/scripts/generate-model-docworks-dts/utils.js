"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocworksModulesToIgnore = exports.getDocworksCommitId = exports.getBetaOnlyWixPackages = exports.getStableWixPackages = exports.getDocworksDTSFolderPath = void 0;
const model_1 = require("../model");
const utils_1 = require("../utils");
const constants_1 = __importDefault(require("../constants"));
const getDocworksDTSFolderPath = (typesPath, fileContext) => `${typesPath}/${fileContext}/${constants_1.default.DOCWORKS_DTS_FILENAME}`;
exports.getDocworksDTSFolderPath = getDocworksDTSFolderPath;
const model = (0, model_1.getWixCodeTypesModel)();
const filterStablePackages = (pkg) => !!pkg.autoCompleteVersions.stable;
const filterBetaOnlyPackages = (pkg) => !pkg.autoCompleteVersions.stable && !!pkg.autoCompleteVersions.beta;
const mapPkgName = (pkg) => pkg.name;
const getStableWixPackages = () => Object.values(model.packages)
    .filter(filterStablePackages)
    .map(mapPkgName)
    .map(utils_1.removeWixNamespaceFromPackage);
exports.getStableWixPackages = getStableWixPackages;
const getBetaOnlyWixPackages = () => Object.values(model.packages)
    .filter(filterBetaOnlyPackages)
    .map(mapPkgName)
    .map(utils_1.removeWixNamespaceFromPackage);
exports.getBetaOnlyWixPackages = getBetaOnlyWixPackages;
const getDocworksCommitId = () => model.docworksCommitId;
exports.getDocworksCommitId = getDocworksCommitId;
const getDocworksModulesToIgnore = () => [
    ...constants_1.default.MODULES_TO_IGNORE,
    ...getStableWixPackages(),
];
exports.getDocworksModulesToIgnore = getDocworksModulesToIgnore;
//# sourceMappingURL=utils.js.map