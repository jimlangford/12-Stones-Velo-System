"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowAnyPropOnContainerChildren = void 0;
const typescript_1 = __importDefault(require("typescript"));
const utils_1 = require("./utils");
const CONTAINABLE_MIXIN = "ContainableMixin";
const CONTAINABLE_MIXIN_PROPERTY_CHILDREN = "children";
const allowAnyPropOnContainerChildren = (ast) => {
    const $w = (0, utils_1.get$wModule)(ast);
    if (!$w) {
        return ast;
    }
    const containableMixin = $w.body.statements.find((statement) => (0, utils_1.isMixinInterface)(statement, CONTAINABLE_MIXIN));
    if (!containableMixin) {
        return ast;
    }
    const containableMixinChildren = containableMixin.members.find((member) => (0, utils_1.isInterfaceMixinMember)(member, CONTAINABLE_MIXIN_PROPERTY_CHILDREN));
    if (!containableMixinChildren ||
        !containableMixinChildren.type ||
        !typescript_1.default.isArrayTypeNode(containableMixinChildren.type)) {
        return ast;
    }
    containableMixinChildren.type = typescript_1.default.factory.createArrayTypeNode(typescript_1.default.factory.createIntersectionTypeNode([
        containableMixinChildren.type.elementType,
        typescript_1.default.factory.createTypeReferenceNode("AnyProperties"),
    ]));
    return ast;
};
exports.allowAnyPropOnContainerChildren = allowAnyPropOnContainerChildren;
//# sourceMappingURL=allowAnyPropOnContainerChildren.js.map