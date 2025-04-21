"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStringHasPrefix = exports.onlyUnique = exports.runAsyncScript = exports.maybeBetaPath = exports.onlyStable = exports.extractPkgNamesFromTripleReferences = exports.getPKGRelevantTargetContextsFromScopes = exports.removeWixNamespaceFromPackage = exports.createTsProgram = exports.getDirectoryFromPath = exports.getPathsCompilerOptions = exports.writeModulesMapToJSON = void 0;
const tmp_1 = __importDefault(require("tmp"));
const typescript_1 = __importDefault(require("typescript"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const lodash_1 = __importDefault(require("lodash"));
const wix_code_common_1 = require("@wix/wix-code-common");
const constants_1 = __importDefault(require("./constants"));
tmp_1.default.setGracefulCleanup(); // cleans tmp file on process exit
const { $W_DECLARATION_FULL_FILENAME } = constants_1.default;
const getFileNameFromPath = (strPath) => {
    const parts = strPath.split("/");
    const fullname = parts[parts.length - 1];
    const [name] = fullname.split(".d.ts");
    return name;
};
const writeModulesMapToJSON = (wixModules, moduleListFilePath) => {
    fs_extra_1.default.ensureFileSync(moduleListFilePath);
    fs_extra_1.default.writeFileSync(moduleListFilePath, JSON.stringify(wixModules, null, "\t"));
};
exports.writeModulesMapToJSON = writeModulesMapToJSON;
const getPathsCompilerOptions = (files) => {
    return files.reduce((targetPaths, file) => {
        if (file.endsWith($W_DECLARATION_FULL_FILENAME)) {
            return targetPaths;
        }
        return Object.assign(Object.assign({}, targetPaths), { [getFileNameFromPath(file)]: [file] });
    }, {});
};
exports.getPathsCompilerOptions = getPathsCompilerOptions;
const getDirectoryFromPath = (strPath) => {
    const parts = strPath.split("/");
    parts.pop();
    return parts.join("/");
};
exports.getDirectoryFromPath = getDirectoryFromPath;
/**
 * Get a typescript compiled program and if has compile time error will throw error with
 * a formalized errors breakdown
 * @param {typescript.Program} program
 */
const detectErrors = (program) => {
    const syntaxErrors = program
        .getSyntacticDiagnostics()
        .filter(diagnostic => diagnostic.category === typescript_1.default.DiagnosticCategory.Error);
    if (lodash_1.default.isEmpty(syntaxErrors)) {
        return;
    }
    const errors = syntaxErrors.map(({ file, start, messageText, code }) => `\tAt ${file.fileName} position ${start} - ${messageText} (code - ${code})`);
    throw new Error("Encountered the following error(s) while compiling:\n" +
        lodash_1.default.join(errors, "\n"));
};
const prepareEmptyTypescriptProgram = (configPath) => {
    const tmpDir = tmp_1.default.dirSync();
    const tmpDirPath = tmpDir.name;
    const tmpConfigPath = `${tmpDirPath}/tsconfig.json`;
    const tmpConfigContent = {
        extends: configPath,
        compilerOptions: {
            noLib: true,
        },
    };
    fs_extra_1.default.writeFileSync(tmpConfigPath, JSON.stringify(tmpConfigContent));
    fs_extra_1.default.writeFileSync(`${tmpDirPath}/empty.js`, "");
    return tmpConfigPath;
};
const createTsProgram = (tsConfigPath) => {
    const host = typescript_1.default.sys;
    const tmpConfigPath = prepareEmptyTypescriptProgram(tsConfigPath);
    const onUnRecoverableConfigFileDiagnostic = (diagnostic) => {
        console.error(diagnostic);
    };
    const parsedCmd = typescript_1.default.getParsedCommandLineOfConfigFile(tmpConfigPath, undefined, Object.assign({ onUnRecoverableConfigFileDiagnostic }, host));
    if (!parsedCmd) {
        return undefined;
    }
    const { options, fileNames } = parsedCmd;
    const program = typescript_1.default.createProgram({
        rootNames: fileNames,
        options,
    });
    // Check for compiler errors and throw if so
    detectErrors(program);
    return program;
};
exports.createTsProgram = createTsProgram;
const removeWixNamespaceFromPackage = (packageName) => {
    return packageName.replace(/@wix\//, "");
};
exports.removeWixNamespaceFromPackage = removeWixNamespaceFromPackage;
const getPKGRelevantTargetContextsFromScopes = (wixPackage) => {
    const targetContexts = [];
    const isBackend = wixPackage.scopes.includes(wix_code_common_1.RuntimeScope.Backend);
    const isFrontend = wixPackage.scopes.includes(wix_code_common_1.RuntimeScope.Frontend);
    if (isBackend) {
        targetContexts.push(wix_code_common_1.FileContext.Backend);
    }
    if (isFrontend) {
        targetContexts.push(wix_code_common_1.FileContext.Page);
    }
    return targetContexts;
};
exports.getPKGRelevantTargetContextsFromScopes = getPKGRelevantTargetContextsFromScopes;
const extractPkgNamesFromTripleReferences = (tripleReferences) => tripleReferences
    .map(tripleReference => /\/\/\/ <reference path=(?:"|')\.\/(.*)\.d\.ts(?:"|') \/>/.exec(tripleReference))
    .map(matches => {
    if (!matches || matches.length < 2) {
        return undefined;
    }
    return matches[1];
})
    .filter((match) => match !== undefined);
exports.extractPkgNamesFromTripleReferences = extractPkgNamesFromTripleReferences;
const onlyStable = (betaPkgList) => (stablePkg) => !betaPkgList.includes(stablePkg);
exports.onlyStable = onlyStable;
const maybeBetaPath = (autocompleteType) => autocompleteType === wix_code_common_1.AutocompleteType.Beta
    ? constants_1.default.DEST_BETA_TYPES_DIR
    : "";
exports.maybeBetaPath = maybeBetaPath;
const runAsyncScript = (fn) => {
    fn().catch((e) => {
        console.error(e);
        process.exit(1);
    });
};
exports.runAsyncScript = runAsyncScript;
const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
};
exports.onlyUnique = onlyUnique;
const isStringHasPrefix = (prefix) => (str) => str.startsWith(prefix);
exports.isStringHasPrefix = isStringHasPrefix;
exports.default = {
    runAsyncScript: exports.runAsyncScript,
    createTsProgram: exports.createTsProgram,
    getDirectoryFromPath: exports.getDirectoryFromPath,
    getPathsCompilerOptions: exports.getPathsCompilerOptions,
    removeWixNamespaceFromPackage: exports.removeWixNamespaceFromPackage,
    getPKGRelevantTargetContextsFromScopes: exports.getPKGRelevantTargetContextsFromScopes,
    extractPkgNamesFromTripleReferences: exports.extractPkgNamesFromTripleReferences,
    onlyStable: exports.onlyStable,
    maybeBetaPath: exports.maybeBetaPath,
    onlyUnique: exports.onlyUnique,
    isStringHasPrefix: exports.isStringHasPrefix
};
//# sourceMappingURL=utils.js.map