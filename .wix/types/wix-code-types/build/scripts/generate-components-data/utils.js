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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseClassesNames = exports.isFunctionTypeNodeWithParameters = exports.getMethodParameterTypeDeclaration = exports.getTypeEntityName = exports.getTypeNodeByName = exports.getStatementByInterfaceName = exports.getModuleDeclarationBody = exports.createCompilerHostForFile = void 0;
const ts = __importStar(require("typescript"));
const createCompilerHostForFile = (file) => {
    return {
        getSourceFile: fileName => {
            if (!file.sourceFile) {
                file.sourceFile = ts.createSourceFile(fileName, file.content, ts.ScriptTarget.ES2015, true);
            }
            return file.sourceFile;
        },
        getDefaultLibFileName: (defaultLibOptions) => "/" + ts.getDefaultLibFileName(defaultLibOptions),
        writeFile: () => {
            // do nothing.
        },
        getCurrentDirectory: () => "/",
        getDirectories: () => [],
        fileExists: fileName => {
            return fileName === file.fileName;
        },
        readFile: () => {
            return file.content;
        },
        getCanonicalFileName: fileName => fileName,
        useCaseSensitiveFileNames: () => true,
        getNewLine: () => "\n",
        getEnvironmentVariable: () => "",
    };
};
exports.createCompilerHostForFile = createCompilerHostForFile;
const getModuleDeclarationBody = (moduleDeclaration) => {
    if ((moduleDeclaration === null || moduleDeclaration === void 0 ? void 0 : moduleDeclaration.body) == null ||
        !ts.isModuleBlock(moduleDeclaration.body)) {
        return undefined;
    }
    return moduleDeclaration.body;
};
exports.getModuleDeclarationBody = getModuleDeclarationBody;
const getStatementByInterfaceName = (rootModuleBlock, interfaceName) => {
    return rootModuleBlock.statements.find((statement) => {
        return (ts.isInterfaceDeclaration(statement) &&
            statement.name.getText() === interfaceName);
    });
};
exports.getStatementByInterfaceName = getStatementByInterfaceName;
const getTypeNodeByName = (rootModuleBlock, typeName) => {
    return rootModuleBlock.statements.find((statement) => {
        return (ts.isTypeAliasDeclaration(statement) &&
            statement.name.getText() === typeName);
    });
};
exports.getTypeNodeByName = getTypeNodeByName;
const getTypeEntityName = (entityName) => {
    return ts.isQualifiedName(entityName)
        ? entityName.right.getText()
        : entityName.getText();
};
exports.getTypeEntityName = getTypeEntityName;
const getMethodParameterTypeDeclaration = (rootModuleBlock, methodSignature) => {
    if (methodSignature.parameters.length === 0) {
        return;
    }
    const [handlerParam] = methodSignature.parameters;
    if (handlerParam.type == null || !ts.isTypeReferenceNode(handlerParam.type)) {
        return;
    }
    const handlerTypeNameText = (0, exports.getTypeEntityName)(handlerParam.type.typeName);
    return (0, exports.getTypeNodeByName)(rootModuleBlock, handlerTypeNameText);
};
exports.getMethodParameterTypeDeclaration = getMethodParameterTypeDeclaration;
const isFunctionTypeNodeWithParameters = (typeNode) => {
    return ts.isFunctionTypeNode(typeNode) && typeNode.parameters.length > 0;
};
exports.isFunctionTypeNodeWithParameters = isFunctionTypeNodeWithParameters;
const getBaseClassesNames = (node) => {
    if (node.heritageClauses == null) {
        return [];
    }
    return node.heritageClauses
        .map(clause => clause.types)
        .reduce((res, types) => [...res, ...types], [])
        .map(type => type.expression)
        .filter((expression) => ts.isIdentifier(expression))
        .map(expression => expression.getText());
};
exports.getBaseClassesNames = getBaseClassesNames;
//# sourceMappingURL=utils.js.map