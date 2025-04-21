"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeConst = void 0;
const typescript_1 = __importDefault(require("typescript"));
const isRelevantConst = (constName) => (statement) => typescript_1.default.isVariableStatement(statement) &&
    statement.declarationList.declarations.find(decleration => typescript_1.default.isIdentifier(decleration.name) &&
        decleration.name.escapedText === constName);
const removeConst = ({ ast, classFixDescription, moduleDecleration, }) => {
    const sitemapEntryConst = moduleDecleration.body.statements.find(isRelevantConst(classFixDescription.constName));
    const filteredStatements = moduleDecleration.body.statements.filter(statement => statement.pos !== (sitemapEntryConst === null || sitemapEntryConst === void 0 ? void 0 : sitemapEntryConst.pos));
    moduleDecleration.body.statements = typescript_1.default.factory.createNodeArray(filteredStatements);
    return ast;
};
exports.removeConst = removeConst;
//# sourceMappingURL=removeConst.js.map