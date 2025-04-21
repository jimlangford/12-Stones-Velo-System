"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeWixAuthElevateFunctionType = void 0;
const typescript_1 = __importDefault(require("typescript"));
const WIX_AUTH_NAME = "wix-auth";
const WIX_AUTH_ELEVATE_METHOD_NAME = "elevate";
const isWixAuthModule = (statement) => typescript_1.default.isModuleDeclaration(statement) && statement.name.text === WIX_AUTH_NAME;
const isElevateMethod = (statement) => {
    var _a;
    return typescript_1.default.isFunctionDeclaration(statement) &&
        ((_a = statement.name) === null || _a === void 0 ? void 0 : _a.escapedText) === WIX_AUTH_ELEVATE_METHOD_NAME;
};
const changeWixAuthElevateFunctionType = (ast) => {
    const wixAuthModule = ast.statements.find(isWixAuthModule);
    if (!wixAuthModule ||
        !wixAuthModule.body ||
        !typescript_1.default.isModuleBlock(wixAuthModule.body)) {
        return ast;
    }
    const elevateFunction = wixAuthModule.body.statements.find(isElevateMethod);
    if (!elevateFunction) {
        return ast;
    }
    elevateFunction.typeParameters = [
        typescript_1.default.factory.createTypeParameterDeclaration("T extends (...arg: any) => any"),
    ];
    elevateFunction.parameters = [
        typescript_1.default.factory.createParameterDeclaration(undefined, undefined, undefined, "func: T"),
    ];
    elevateFunction.type = typescript_1.default.factory.createTypeReferenceNode("(...param: Parameters<T>) => ReturnType<T>");
    return ast;
};
exports.changeWixAuthElevateFunctionType = changeWixAuthElevateFunctionType;
//# sourceMappingURL=changeWixAuthElevateFunctionType.js.map