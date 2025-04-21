"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowAnyPropOnTypes = void 0;
const allowAnyPropOnType_1 = require("./allowAnyPropOnType");
const classesToFix = [
    {
        moduleName: "wix-users-backend",
        name: "UserInfo",
    },
    {
        moduleName: "wix-crm",
        name: "ContactInfo",
    },
];
const allowAnyPropOnTypes = (ast) => {
    classesToFix.forEach(typeDescription => {
        ast = (0, allowAnyPropOnType_1.allowAnyPropOnUserInfoType)({ ast, typeDescription });
    });
    return ast;
};
exports.allowAnyPropOnTypes = allowAnyPropOnTypes;
//# sourceMappingURL=main.js.map