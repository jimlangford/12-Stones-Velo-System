"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceFileModule = exports.get$wModule = exports.fetch$wModuleFromGlobal = exports.isInterfaceMixinMember = exports.isMixinInterface = exports.isGlobalModule = exports.is$wModule = void 0;
const typescript_1 = __importDefault(require("typescript"));
const constants_1 = __importDefault(require("../constants"));
const is$wModule = (statement) => typescript_1.default.isModuleDeclaration(statement) &&
    statement.name.text === constants_1.default.$W_MODULE_NAME &&
    !!statement.body &&
    typescript_1.default.isModuleBlock(statement.body);
exports.is$wModule = is$wModule;
const isGlobalModule = (statement) => typescript_1.default.isModuleDeclaration(statement) &&
    statement.name.text === "global" &&
    !!statement.body &&
    typescript_1.default.isModuleBlock(statement.body);
exports.isGlobalModule = isGlobalModule;
const isMixinInterface = (statement, mixinName) => typescript_1.default.isInterfaceDeclaration(statement) &&
    statement.name.escapedText === mixinName;
exports.isMixinInterface = isMixinInterface;
const isInterfaceMixinMember = (member, name) => !!(member.name &&
    typescript_1.default.isIdentifier(member.name) &&
    member.name.escapedText === name);
exports.isInterfaceMixinMember = isInterfaceMixinMember;
const fetch$wModuleFromGlobal = (statement) => {
    return statement.body.statements.find(exports.is$wModule);
};
exports.fetch$wModuleFromGlobal = fetch$wModuleFromGlobal;
const get$wModule = (ast) => {
    const globalStatment = ast.statements.find(exports.isGlobalModule);
    const $w = globalStatment
        ? (0, exports.fetch$wModuleFromGlobal)(globalStatment)
        : ast.statements.find(exports.is$wModule);
    return $w;
};
exports.get$wModule = get$wModule;
const isSourceFileModule = (moduleName) => (statement) => typescript_1.default.isModuleDeclaration(statement) &&
    statement.name.text === moduleName &&
    !!statement.body &&
    typescript_1.default.isModuleBlock(statement.body);
const getSourceFileModule = (ast, moduleName) => {
    const moduleDecleration = ast === null || ast === void 0 ? void 0 : ast.statements.find(isSourceFileModule(moduleName));
    if (!moduleDecleration) {
        return null;
    }
    return moduleDecleration;
};
exports.getSourceFileModule = getSourceFileModule;
//# sourceMappingURL=utils.js.map