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
const ts = __importStar(require("typescript"));
const utils_1 = require("./utils");
const components_data_parser_1 = __importDefault(require("./components-data-parser"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = __importDefault(require("../constants"));
const createProgram = (declarationsFileContents) => {
    const file = {
        fileName: constants_1.default.DOCWORKS_DTS_FILENAME,
        content: declarationsFileContents,
    };
    const compilerHost = (0, utils_1.createCompilerHostForFile)(file);
    return ts.createProgram([file.fileName], {}, compilerHost);
};
const getSourceFile = (program) => {
    const sourceFile = program.getSourceFile(constants_1.default.DOCWORKS_DTS_FILENAME);
    if (!sourceFile) {
        throw new Error(`Failed creating source file ${constants_1.default.DOCWORKS_DTS_FILENAME}`);
    }
    return sourceFile;
};
/**
 * @throws {Error} in case of parsing failure
 */
const generateComponentsDataFromDTS = (declarationsPath) => {
    const declarationsFileContents = fs_1.default.readFileSync(declarationsPath, "utf-8");
    if (!declarationsFileContents) {
        throw new Error(`${declarationsPath} was not found`);
    }
    const program = createProgram(declarationsFileContents);
    const typeChecker = program.getTypeChecker();
    const sourceFile = getSourceFile(program);
    return (0, components_data_parser_1.default)(typeChecker, sourceFile).parse();
};
exports.default = generateComponentsDataFromDTS;
//# sourceMappingURL=components-data-generator.js.map