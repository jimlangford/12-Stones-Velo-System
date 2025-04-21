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
const constants_1 = __importDefault(require("../constants"));
const utils_1 = require("./utils");
const utils_2 = require("../ast-patches/utils");
const editor_elements_semantic_classnames_1 = require("@wix/editor-elements-semantic-classnames");
const EVENT_TYPE_JS_DOC_TAG_NAME = "eventType";
const API_REFERENCE_URL_REGEX = /https:\/\/.*#/;
const getComponentsDataParser = (typeChecker, sourceFile) => {
    const handlersCache = {};
    let eventHandlersModuleBody;
    const getHandlerArguments = (methodSignature) => {
        var _a;
        const parameterTypeDeclaration = (0, utils_1.getMethodParameterTypeDeclaration)(eventHandlersModuleBody, methodSignature);
        if (parameterTypeDeclaration == null ||
            !(0, utils_1.isFunctionTypeNodeWithParameters)(parameterTypeDeclaration.type)) {
            return [];
        }
        const eventHandlerParameter = parameterTypeDeclaration.type.parameters[0];
        return [
            {
                name: eventHandlerParameter.name.getText(),
                type: `${constants_1.default.$W_MODULE_NAME}.${(_a = eventHandlerParameter.type) === null || _a === void 0 ? void 0 : _a.getText()}`,
            },
        ];
    };
    const buildEventHandler = (interfaceName, methodSignature) => {
        var _a, _b;
        const symbol = typeChecker.getSymbolAtLocation(methodSignature.name);
        const type = (_b = (_a = symbol === null || symbol === void 0 ? void 0 : symbol.getJsDocTags()) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text;
        if (!type) {
            throw new Error(`The member must have a @eventtype JSDoc tag: ${methodSignature.name.getText()}`);
        }
        return {
            origin: interfaceName,
            name: methodSignature.name.getText(),
            description: ts.displayPartsToString(symbol === null || symbol === void 0 ? void 0 : symbol.getDocumentationComment(typeChecker)),
            kind: "function",
            type: ts.displayPartsToString(type),
            handlerArgs: getHandlerArguments(methodSignature),
        };
    };
    const isMethodEventHandler = (member) => {
        var _a;
        if (!member.name) {
            return false;
        }
        const docTags = (_a = typeChecker
            .getSymbolAtLocation(member.name)) === null || _a === void 0 ? void 0 : _a.getJsDocTags();
        return (docTags != null &&
            docTags.some(tag => tag.name === EVENT_TYPE_JS_DOC_TAG_NAME));
    };
    const overrideOriginWithRootInterface = (e, origin) => {
        return Object.assign(Object.assign({}, e), { origin });
    };
    const mergeEventHandlers = (soFar, toMerge) => {
        return [...soFar, ...toMerge];
    };
    const getRootEventHandlers = (rootInterfaceName, interfaceNode) => {
        return interfaceNode.members
            .filter((member) => isMethodEventHandler(member))
            .map(member => buildEventHandler(rootInterfaceName, member));
    };
    const getBaseClassesEventHandlers = (rootInterfaceName, interfaceNode) => {
        const baseClassesNodes = (0, utils_1.getBaseClassesNames)(interfaceNode)
            .map(baseClassName => (0, utils_1.getStatementByInterfaceName)(eventHandlersModuleBody, baseClassName))
            .filter((statement) => Boolean(statement));
        return baseClassesNodes
            .map(baseClassNode => getEventHandlers(rootInterfaceName, baseClassNode))
            .reduce(mergeEventHandlers, []);
    };
    const getEventHandlers = (rootInterfaceName, interfaceNode) => {
        const interfaceName = interfaceNode.name.getText();
        if (handlersCache[interfaceName]) {
            return handlersCache[interfaceName];
        }
        const rootMembers = getRootEventHandlers(rootInterfaceName, interfaceNode);
        const baseHandlers = getBaseClassesEventHandlers(rootInterfaceName, interfaceNode);
        const componentHandlers = mergeEventHandlers(rootMembers, baseHandlers).map(e => overrideOriginWithRootInterface(e, rootInterfaceName));
        handlersCache[interfaceName] = componentHandlers;
        return componentHandlers;
    };
    const getApiRefLink = (interfaceNode) => {
        const symbol = typeChecker.getSymbolAtLocation(interfaceNode.name);
        const documentation = ts.displayPartsToString(symbol === null || symbol === void 0 ? void 0 : symbol.getDocumentationComment(typeChecker));
        const matches = documentation.match(API_REFERENCE_URL_REGEX);
        return matches ? matches[0] : undefined;
    };
    const get$wComponentsModuleBody = (source) => {
        const $wModuleDeclaration = (0, utils_2.get$wModule)(source);
        const $wModuleBody = (0, utils_1.getModuleDeclarationBody)($wModuleDeclaration);
        if (!$wModuleBody) {
            throw new Error(`Failed finding the ${constants_1.default.$W_MODULE_NAME} interface`);
        }
        return $wModuleBody;
    };
    const generateComponentsMap = () => {
        eventHandlersModuleBody = get$wComponentsModuleBody(sourceFile);
        const interfaces = eventHandlersModuleBody.statements.filter((statement) => {
            return ts.isInterfaceDeclaration(statement);
        });
        return interfaces.reduce((componentsMap, interfaceNode) => {
            const interfaceNodeName = interfaceNode.name.getText();
            const semanticClassNames = editor_elements_semantic_classnames_1.semanticClassNames[interfaceNodeName];
            const cssClassRefLink = editor_elements_semantic_classnames_1.cssClassRefs[interfaceNodeName];
            return Object.assign(componentsMap, {
                [`${constants_1.default.$W_MODULE_NAME}.${interfaceNodeName}`]: Object.assign({ apiRefLink: getApiRefLink(interfaceNode), events: getEventHandlers(interfaceNodeName, interfaceNode), semanticClassNames }, (semanticClassNames && { cssClassRefLink })),
            });
        }, {});
    };
    return {
        parse: generateComponentsMap,
    };
};
exports.default = getComponentsDataParser;
//# sourceMappingURL=components-data-parser.js.map