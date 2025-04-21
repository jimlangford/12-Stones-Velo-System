"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowAnyPropOnUserInfoType = void 0;
const typescript_1 = __importDefault(require("typescript"));
const utils_1 = require("../utils");
const isRelevantTypeAlias = (typeAliasName) => (statement) => typescript_1.default.isTypeAliasDeclaration(statement) &&
    statement.name.escapedText === typeAliasName;
const allowAnyPropOnUserInfoType = ({ ast, typeDescription, }) => {
    const moduleDecleration = (0, utils_1.getSourceFileModule)(ast, typeDescription.moduleName);
    const relevantType = moduleDecleration === null || moduleDecleration === void 0 ? void 0 : moduleDecleration.body.statements.find(isRelevantTypeAlias(typeDescription.name));
    if (!relevantType) {
        return ast;
    }
    relevantType.type = typescript_1.default.factory.createIntersectionTypeNode([relevantType.type, typescript_1.default.factory.createTypeReferenceNode("AnyProperties")]);
    return ast;
};
exports.allowAnyPropOnUserInfoType = allowAnyPropOnUserInfoType;
//# sourceMappingURL=allowAnyPropOnType.js.map