"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelGenerators = void 0;
const path_1 = __importDefault(require("path"));
const selector_declaration_generator_1 = __importDefault(require("./selector-declaration-generator"));
const scoped_packages_generator_1 = __importDefault(require("./scoped-packages-generator"));
const run_docworks_1 = __importDefault(require("./run-docworks"));
const beta_packages_generator_1 = __importDefault(require("./beta-packages-generator"));
const constants_1 = __importDefault(require("../constants"));
const getModelGenerators = (docsPath) => [
    () => (0, run_docworks_1.default)(docsPath),
    () => (0, beta_packages_generator_1.default)(),
    () => (0, selector_declaration_generator_1.default)(docsPath, path_1.default.join(constants_1.default.TYPES_PAGES_PATH, constants_1.default.$W_DECLARATION_FULL_FILENAME)),
    () => (0, scoped_packages_generator_1.default)(docsPath, constants_1.default.DEST_TYPES_PATH),
];
exports.getModelGenerators = getModelGenerators;
//# sourceMappingURL=modelGenerators.js.map