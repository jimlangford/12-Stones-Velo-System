"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmp_1 = __importDefault(require("tmp"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const utils_1 = require("../utils");
tmp_1.default.setGracefulCleanup(); // cleans tmp file on process exit
/**
 * Takes in an array of dts files paths and returns a list of modules declared
 * in those dts
 * @param {[string]} dtsPaths - absolute paths
 */
const extractModules = (dtsPaths = []) => {
    const configFile = tmp_1.default.fileSync();
    dtsPaths.forEach(filePath => {
        if (!fs_extra_1.default.existsSync(filePath)) {
            throw new Error(`file ${filePath} does not exist`);
        }
    });
    const tsConfig = {
        files: dtsPaths,
        compilerOptions: {
            noLib: true,
            allowSyntheticDefaultImports: true,
            paths: (0, utils_1.getPathsCompilerOptions)(dtsPaths),
        },
    };
    fs_extra_1.default.writeFileSync(configFile.fd, JSON.stringify(tsConfig));
    const program = (0, utils_1.createTsProgram)(configFile.name);
    if (!program) {
        return [];
    }
    const modules = program
        .getSourceFiles()
        .filter((source) => !!source.ambientModuleNames)
        .map(source => source.ambientModuleNames)
        .flat();
    return modules;
};
exports.default = extractModules;
//# sourceMappingURL=extractDtsModules.js.map