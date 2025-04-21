#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const extractDtsModules_1 = __importDefault(require("./extractDtsModules"));
const constants_1 = __importStar(require("../constants"));
const wix_code_common_1 = require("@wix/wix-code-common");
const utils_1 = require("../utils");
const model_1 = require("../model");
const projectRoot = path_1.default.join(__dirname, "../../");
const nonDeprecatedModules = new Set((0, model_1.getNonDeprecatedModules)());
const moduleListTypes = {
    [wix_code_common_1.AutocompleteType.Stable]: {
        typesRootFolder: path_1.default.join(projectRoot, constants_1.default.DEST_TYPES_PATH),
        moduleListFilePath: path_1.default.join(projectRoot, constants_1.default.DEST_JSONS_PATH, wix_code_common_1.MODULE_LIST_FILENAME),
        deprecatedModuleListFilePath: path_1.default.join(projectRoot, constants_1.default.DEST_JSONS_PATH, wix_code_common_1.DEPRECATED_MODULE_LIST_FILENAME),
        nonDeprecatedSuggestionsFilePath: path_1.default.join(projectRoot, constants_1.default.DEST_JSONS_PATH, wix_code_common_1.NON_DEPRECATED_MODULE_LIST_FILENAME)
    },
    [wix_code_common_1.AutocompleteType.Beta]: {
        typesRootFolder: path_1.default.join(projectRoot, constants_1.default.DEST_TYPES_PATH, constants_1.default.DEST_BETA_TYPES_DIR),
        moduleListFilePath: path_1.default.join(projectRoot, constants_1.default.DEST_JSONS_PATH, wix_code_common_1.MODULE_LIST_BETA_FILENAME),
        deprecatedModuleListFilePath: path_1.default.join(projectRoot, constants_1.default.DEST_JSONS_PATH, wix_code_common_1.DEPRECATED_MODULE_LIST_BETA_FILENAME),
        nonDeprecatedSuggestionsFilePath: path_1.default.join(projectRoot, constants_1.default.DEST_JSONS_PATH, wix_code_common_1.NON_DEPRECATED_MODULE_LIST_BETA_FILENAME)
    },
};
const getWixModulesMapForContexts = (typesRootFolder, initialWixModules = null) => {
    const wixModules = {
        [wix_code_common_1.FileContext.Page]: maybeInitialWixModules(wix_code_common_1.FileContext.Page, initialWixModules),
        [wix_code_common_1.FileContext.Backend]: maybeInitialWixModules(wix_code_common_1.FileContext.Backend, initialWixModules),
        [wix_code_common_1.FileContext.Public]: maybeInitialWixModules(wix_code_common_1.FileContext.Public, initialWixModules),
    };
    const contexts = Object.values(constants_1.default.FileContext);
    for (const context of contexts) {
        const contextTypesFolder = `${typesRootFolder}/${context}`;
        const sourcefiles = fs_extra_1.default
            .readdirSync(contextTypesFolder)
            .map(fileName => `${contextTypesFolder}/${fileName}`)
            .filter(f => f.endsWith(constants_1.default.DOCWORKS_DTS_FILENAME) ||
            f.endsWith(constants_1.default.WIX_PACKAGES_DTS_FILENAME));
        const moduleListArray = (0, extractDtsModules_1.default)(sourcefiles);
        const uniqueModuleList = moduleListArray
            .concat(wixModules[context])
            .filter(utils_1.onlyUnique)
            .sort();
        wixModules[context] = uniqueModuleList;
    }
    return wixModules;
};
const maybeInitialWixModules = (context, initialWixModules = null) => (initialWixModules ? [...initialWixModules[context]] : []);
const isNonDeprecatedModule = (module) => nonDeprecatedModules.has(module);
const generateModulesMapJson = (modules, filePath, moduleFilter) => {
    const contexts = Object.values(constants_1.default.FileContext);
    const updatedModulesMap = Object.assign({}, modules);
    for (const context of contexts) {
        updatedModulesMap[context] = updatedModulesMap[context].filter((module) => {
            const isValid = moduleFilter.onlyWixPrefix ? (0, utils_1.isStringHasPrefix)(constants_1.WIX_PACKAGE_IMPORT_PREFIX)(module) : true;
            if (!isValid) {
                return false;
            }
            if (moduleFilter.onlyDeprecated) {
                return !isNonDeprecatedModule(module);
            }
            if (moduleFilter.onlyNonDeprecated) {
                return isNonDeprecatedModule(module);
            }
            return true;
        });
    }
    (0, utils_1.writeModulesMapToJSON)(updatedModulesMap, filePath);
};
const runGenerateWixModuleListsScript = () => {
    const stableWixModulesMap = getWixModulesMapForContexts(moduleListTypes.stable.typesRootFolder);
    const betaWixModulesMap = getWixModulesMapForContexts(moduleListTypes.beta.typesRootFolder, stableWixModulesMap);
    generateModulesMapJson(stableWixModulesMap, moduleListTypes.stable.moduleListFilePath, {
        onlyWixPrefix: true,
    });
    generateModulesMapJson(betaWixModulesMap, moduleListTypes.beta.moduleListFilePath, {
        onlyWixPrefix: true,
    });
    generateModulesMapJson(stableWixModulesMap, moduleListTypes.stable.deprecatedModuleListFilePath, {
        onlyDeprecated: true,
    });
    generateModulesMapJson(betaWixModulesMap, moduleListTypes.beta.deprecatedModuleListFilePath, {
        onlyDeprecated: true,
    });
    generateModulesMapJson(stableWixModulesMap, moduleListTypes.stable.nonDeprecatedSuggestionsFilePath, {
        onlyWixPrefix: true,
        onlyNonDeprecated: true,
    });
    generateModulesMapJson(betaWixModulesMap, moduleListTypes.beta.nonDeprecatedSuggestionsFilePath, {
        onlyWixPrefix: true,
        onlyNonDeprecated: true,
    });
};
runGenerateWixModuleListsScript();
//# sourceMappingURL=main.js.map