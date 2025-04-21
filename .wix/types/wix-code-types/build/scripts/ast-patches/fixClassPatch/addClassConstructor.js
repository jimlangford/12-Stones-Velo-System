"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addClassConstructor = void 0;
const typescript_1 = __importDefault(require("typescript"));
const isRelevantClass = (className) => (statement) => { var _a; return typescript_1.default.isClassDeclaration(statement) && ((_a = statement.name) === null || _a === void 0 ? void 0 : _a.escapedText) === className; };
const addConstructorToClassStatement = (sitemapEntryClass) => {
    const constructorParams = typescript_1.default.factory.createParameterDeclaration(undefined, undefined, undefined, "...args: any[]");
    const constructorStatement = typescript_1.default.factory.createConstructorDeclaration(undefined, undefined, [constructorParams], undefined);
    sitemapEntryClass.members = typescript_1.default.factory.createNodeArray([
        constructorStatement,
        ...sitemapEntryClass.members,
    ]);
};
const addClassConstructor = ({ ast, classFixDescription, moduleDecleration, }) => {
    const relevantClass = moduleDecleration.body.statements.find(isRelevantClass(classFixDescription.name));
    if (!relevantClass) {
        return ast;
    }
    addConstructorToClassStatement(relevantClass);
    return ast;
};
exports.addClassConstructor = addClassConstructor;
//# sourceMappingURL=addClassConstructor.js.map