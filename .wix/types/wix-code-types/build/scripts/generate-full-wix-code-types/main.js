#!/usr/bin/env node
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
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const constants_1 = __importDefault(require("../constants"));
const wix_code_common_1 = require("@wix/wix-code-common");
const projectRoot = path_1.default.join(__dirname, "../../");
const FULL_WIX_CODE_DECLARATION_PATH = path_1.default.join(projectRoot, constants_1.default.DEST_JSONS_PATH, constants_1.default.FULL_WIX_CODE_DECLARATION_FILENAME);
const FULL_WIX_CODE_DECLARATION_BETA_PATH = path_1.default.join(projectRoot, constants_1.default.DEST_JSONS_PATH, constants_1.default.FULL_WIX_CODE_DECLARATION_BETA_FILENAME);
const getFixedPath = (libPath) => {
    const relativePath = libPath.split(`${wix_code_common_1.WIX_CODE_TYPES_MODULE_NAME}/`).pop();
    return `@wix/${wix_code_common_1.WIX_CODE_TYPES_MODULE_NAME}/${relativePath}`;
};
const getDeclarationFilesFromTsConfig = (configPath) => {
    const program = (0, utils_1.createTsProgram)(configPath);
    if (!program) {
        return [];
    }
    return program
        .getSourceFiles()
        .filter((file) => file.isDeclarationFile)
        .map((file) => file.fileName);
};
function generateFullWixCodeDeclarations(configPaths, jsonPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const declarations = {};
        Object.keys(configPaths).forEach((context) => {
            const configPath = configPaths[context];
            if (!configPath) {
                return;
            }
            declarations[context] = getDeclarationFilesFromTsConfig(path_1.default.join(projectRoot, configPath));
        });
        const uniqueLibs = [
            ...new Set(Object.values(declarations).reduce((soFar, libs) => {
                return [...soFar, ...libs];
            }, [])),
        ];
        const libs = uniqueLibs.map((libPath) => {
            return {
                path: getFixedPath(libPath),
                content: fs_extra_1.default.readFileSync(libPath, "utf8"),
            };
        });
        Object.keys(declarations).forEach((contextKey) => {
            declarations[contextKey] = declarations[contextKey].map((filePath) => getFixedPath(filePath));
        });
        const fullJson = {
            libs,
            contexts: declarations,
        };
        fs_extra_1.default.ensureFileSync(jsonPath);
        fs_extra_1.default.writeFileSync(jsonPath, JSON.stringify(fullJson, null, 2));
    });
}
const fullWixCodeTypesKinds = [
    {
        kind: wix_code_common_1.AutocompleteType.Stable,
        configs: constants_1.default.TS_CONFIG_PATHS,
        fullWixCodeTypesPath: FULL_WIX_CODE_DECLARATION_PATH,
    },
    {
        kind: wix_code_common_1.AutocompleteType.Beta,
        configs: constants_1.default.TS_CONFIG_BETA_PATHS,
        fullWixCodeTypesPath: FULL_WIX_CODE_DECLARATION_BETA_PATH,
    },
];
const runGenerateFullWixCodeDeclarations = () => {
    for (const fullWixCodeTypesKind of fullWixCodeTypesKinds) {
        generateFullWixCodeDeclarations(fullWixCodeTypesKind.configs, fullWixCodeTypesKind.fullWixCodeTypesPath);
    }
};
runGenerateFullWixCodeDeclarations();
//# sourceMappingURL=main.js.map