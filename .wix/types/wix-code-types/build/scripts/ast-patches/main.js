"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const lodash_1 = __importDefault(require("lodash"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const constants_1 = __importDefault(require("../constants"));
const patches_1 = __importDefault(require("./patches"));
const applyAllPatches = lodash_1.default.flow(patches_1.default);
const RELATIVE_PATH_TO_ROOT_FOLDER = "../../";
const transformer = ( /* context*/) => (sourceAst) => typescript_1.default.visitNode(sourceAst, mainNode => {
    try {
        return applyAllPatches(mainNode);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});
const getSourceAst = (sourceFilesPath) => {
    const sourcefiles = fs_extra_1.default
        .readdirSync(sourceFilesPath)
        .map(fileName => path_1.default.join(__dirname, RELATIVE_PATH_TO_ROOT_FOLDER, constants_1.default.TYPES_COMMON_PATH, fileName));
    const tsProgram = typescript_1.default.createProgram(sourcefiles, {});
    const sourceAst = sourcefiles.map(filePath => {
        return {
            path: filePath,
            ast: tsProgram.getSourceFile(filePath),
        };
    });
    if (!sourceAst) {
        throw new Error("source ast not found");
    }
    return sourceAst;
};
const runASTPatches = (sourceFilesPath) => {
    const sourceAst = getSourceAst(sourceFilesPath);
    const transformationResult = sourceAst.map((file) => {
        return {
            path: file.path,
            ast: file.ast ? typescript_1.default.transform(file.ast, [transformer]) : undefined,
        };
    });
    transformationResult.forEach(file => {
        if (!file.ast) {
            return;
        }
        const newContent = typescript_1.default.createPrinter().printFile(file.ast.transformed[0]);
        fs_extra_1.default.ensureFileSync(file.path);
        fs_extra_1.default.writeFileSync(file.path, newContent);
    });
};
const DECLARATIONS_PATH = path_1.default.join(__dirname, RELATIVE_PATH_TO_ROOT_FOLDER, constants_1.default.TYPES_COMMON_PATH);
if (!fs_extra_1.default.existsSync(DECLARATIONS_PATH)) {
    throw new Error(`Cannot find the declaration folder at [${DECLARATIONS_PATH}]`);
}
runASTPatches(DECLARATIONS_PATH);
//# sourceMappingURL=main.js.map