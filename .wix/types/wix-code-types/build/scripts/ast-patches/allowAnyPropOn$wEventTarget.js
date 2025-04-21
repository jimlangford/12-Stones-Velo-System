"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowAnyPropOn$wEventTarget = void 0;
const typescript_1 = __importDefault(require("typescript"));
const utils_1 = require("./utils");
const allowAnyPropOn$wEventTarget = (ast) => {
    const $w = (0, utils_1.get$wModule)(ast);
    if (!$w) {
        return ast;
    }
    const $wEvent = $w.body.statements.find((statement) => (0, utils_1.isMixinInterface)(statement, "Event"));
    if (!$wEvent) {
        return ast;
    }
    const $wEventTarget = $wEvent.members.find((member) => (0, utils_1.isInterfaceMixinMember)(member, "target"));
    if (!$wEventTarget || !$wEventTarget.type) {
        return ast;
    }
    $wEventTarget.type = typescript_1.default.factory.createIntersectionTypeNode([
        $wEventTarget.type,
        typescript_1.default.factory.createTypeReferenceNode("AnyProperties"),
    ]);
    return ast;
};
exports.allowAnyPropOn$wEventTarget = allowAnyPropOn$wEventTarget;
//# sourceMappingURL=allowAnyPropOn$wEventTarget.js.map