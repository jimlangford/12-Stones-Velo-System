"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldBundleDts = exports.createTripleReference = exports.isBetaPkg = exports.isStablePkg = exports.getTypesDest = exports.getEmptyTripleReferenceTypesMap = exports.getEmptyDestinations = exports.getWixPackageTypingsPath = exports.wrapInAmbientModuleDeclaration = exports.removeDeclareFromAmbientModule = exports.dtsStripInternalsPreprocessor = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const wix_code_common_1 = require("@wix/wix-code-common");
const constants_1 = __importDefault(require("../constants"));
const shouldBundleDts = (typingPath) => {
    const sourceFile = typescript_1.default.createSourceFile(typingPath, fs_extra_1.default.readFileSync(typingPath).toString(), typescript_1.default.ScriptTarget.Latest, true);
    return hasImports(sourceFile) || hasInternals(sourceFile);
};
exports.shouldBundleDts = shouldBundleDts;
const hasImports = (sourceFile) => {
    return Boolean(typescript_1.default.forEachChild(sourceFile, node => {
        if (isImportOrExportWithModuleSpecifier(node)) {
            return true;
        }
    }));
};
const hasInternals = (sourceFile) => {
    const visit = (node) => {
        if (isInternalDeclaration(node)) {
            return true;
        }
        return typescript_1.default.forEachChild(node, visit);
    };
    return Boolean(typescript_1.default.forEachChild(sourceFile, visit));
};
const dtsStripInternalsPreprocessor = () => {
    return {
        name: "dts-stripinternals-preprocessor",
        resolveId(id) {
            return isDeclerationFile(id) ? id : null;
        },
        load(id) {
            return isDeclerationFile(id) ? typescript_1.default.sys.readFile(id) : null;
        },
        transform(source, id) {
            if (!isDeclerationFile(id)) {
                return null;
            }
            const code = removeInternalDeclerations(source, id);
            return { code, map: { mappings: "" } };
        },
    };
};
exports.dtsStripInternalsPreprocessor = dtsStripInternalsPreprocessor;
const isInternalDeclaration = (node) => {
    var _a;
    return (_a = node === null || node === void 0 ? void 0 : node.jsDoc) === null || _a === void 0 ? void 0 : _a.some((doc) => { var _a; return (_a = doc.tags) === null || _a === void 0 ? void 0 : _a.some(tag => tag.tagName.escapedText === "internal"); });
};
const isImportOrExportWithModuleSpecifier = (node) => {
    return Boolean(typescript_1.default.isImportDeclaration(node) ||
        (typescript_1.default.isExportDeclaration(node) && node.moduleSpecifier));
};
const isDeclerationFile = (id) => id.endsWith(".d.ts");
const removeInternalDeclerations = (source, id) => {
    const sourceFile = typescript_1.default.createSourceFile(id, source, typescript_1.default.ScriptTarget.Latest, true);
    const { transformed: [transformedSourceFile], } = typescript_1.default.transform(sourceFile, [internalDeclarationsRemover]);
    const printer = typescript_1.default.createPrinter();
    return printer.printFile(transformedSourceFile);
};
const internalDeclarationsRemover = context => {
    const visit = node => {
        return isInternalDeclaration(node)
            ? undefined
            : typescript_1.default.visitEachChild(node, visit, context);
    };
    return sourceFile => typescript_1.default.visitNode(sourceFile, visit);
};
const removeDeclareFromAmbientModule = (moduleBody) => {
    return moduleBody
        .split("\n")
        .map(line => line.replace(/^\s*(export\s+)?declare\s/, "$1"))
        .join("\n");
};
exports.removeDeclareFromAmbientModule = removeDeclareFromAmbientModule;
const wrapInAmbientModuleDeclaration = (packageName, moduleBody) => {
    const indentedBody = moduleBody.replace(/\n/g, "\n  ").trim();
    let code = "";
    code += `declare module "${packageName}" {\n  `;
    code += indentedBody;
    code += "\n}\n";
    return code;
};
exports.wrapInAmbientModuleDeclaration = wrapInAmbientModuleDeclaration;
const getWixPackageTypingsPath = (packagePath) => {
    var _a;
    const packageJson = fs_extra_1.default.readJSONSync(path_1.default.join(packagePath, constants_1.default.PACKAGE_JSON));
    const typings = (_a = packageJson.typings) !== null && _a !== void 0 ? _a : packageJson.types;
    if (typings == null || typeof typings !== "string") {
        return null;
    }
    return path_1.default.join(packagePath, typings);
};
exports.getWixPackageTypingsPath = getWixPackageTypingsPath;
const getEmptyDestinations = () => ({
    [wix_code_common_1.DEST_TYPES_DIR_COMMON]: [],
    [wix_code_common_1.FileContext.Backend]: [],
    [wix_code_common_1.FileContext.Page]: [],
});
exports.getEmptyDestinations = getEmptyDestinations;
const getEmptyTripleReferenceTypesMap = () => ({
    [wix_code_common_1.AutocompleteType.Stable]: Object.assign({}, getEmptyDestinations()),
    [wix_code_common_1.AutocompleteType.Beta]: Object.assign({}, getEmptyDestinations()),
});
exports.getEmptyTripleReferenceTypesMap = getEmptyTripleReferenceTypesMap;
const getTypesDest = () => {
    const ROOT_PATH = path_1.default.resolve(process.cwd());
    const TYPES_PATH = path_1.default.resolve(ROOT_PATH, constants_1.default.DEST_TYPES_PATH);
    return TYPES_PATH;
};
exports.getTypesDest = getTypesDest;
const isStablePkg = (pkg) => !!pkg.autoCompleteVersions.stable;
exports.isStablePkg = isStablePkg;
const isBetaPkg = (pkg) => !!pkg.autoCompleteVersions.beta;
exports.isBetaPkg = isBetaPkg;
const createTripleReference = (filePath) => `/// <reference path="${filePath}.d.ts" />`;
exports.createTripleReference = createTripleReference;
//# sourceMappingURL=utils.js.map