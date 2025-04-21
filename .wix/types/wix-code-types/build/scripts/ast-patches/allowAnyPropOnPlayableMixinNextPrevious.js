"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowAnyPropOnPlayableMixinNextPrevious = void 0;
const typescript_1 = __importDefault(require("typescript"));
const utils_1 = require("./utils");
const PLAYABLE_MIXIN_NAME = "PlayableMixin";
const PLAYABLE_MIXIN_NEXT_PROPERTY_NAME = "next";
const PLAYABLE_MIXIN_PREVIOUS_PROPERTY_NAME = "previous";
const $wMixinAllowAnyPropTypeArguments = ({ ast, mixinName, memberName, }) => {
    const $w = (0, utils_1.get$wModule)(ast);
    if (!$w) {
        return;
    }
    const mixin = $w.body.statements.find((statement) => (0, utils_1.isMixinInterface)(statement, mixinName));
    if (!mixin) {
        return;
    }
    const mixinMember = mixin.members.find((member) => (0, utils_1.isInterfaceMixinMember)(member, memberName));
    if (!mixinMember ||
        !mixinMember.type ||
        !typescript_1.default.isTypeReferenceNode(mixinMember.type) ||
        !mixinMember.type.typeArguments) {
        return;
    }
    const newTypeArguments = [
        typescript_1.default.factory.createIntersectionTypeNode([
            mixinMember.type.typeArguments[0],
            typescript_1.default.factory.createTypeReferenceNode("AnyProperties"),
        ]),
    ];
    mixinMember.type.typeArguments = newTypeArguments;
};
const allowAnyPropOnPlayableMixinNextPrevious = (ast) => {
    $wMixinAllowAnyPropTypeArguments({
        ast,
        mixinName: PLAYABLE_MIXIN_NAME,
        memberName: PLAYABLE_MIXIN_NEXT_PROPERTY_NAME,
    });
    $wMixinAllowAnyPropTypeArguments({
        ast,
        mixinName: PLAYABLE_MIXIN_NAME,
        memberName: PLAYABLE_MIXIN_PREVIOUS_PROPERTY_NAME,
    });
    return ast;
};
exports.allowAnyPropOnPlayableMixinNextPrevious = allowAnyPropOnPlayableMixinNextPrevious;
//# sourceMappingURL=allowAnyPropOnPlayableMixinNextPrevious.js.map