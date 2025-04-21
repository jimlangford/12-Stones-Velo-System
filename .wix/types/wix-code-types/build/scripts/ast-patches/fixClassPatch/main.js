"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixClassesMainPatch = void 0;
const utils_1 = require("../utils");
const changeInterfaceToClass_1 = require("./changeInterfaceToClass");
const removeConst_1 = require("./removeConst");
const addClassConstructor_1 = require("./addClassConstructor");
const classesToFix = [
    {
        moduleName: "wix-router",
        name: "WixRouterSitemapEntry",
        constName: "wixRouterSitemapEntry",
    },
];
const classPatches = [changeInterfaceToClass_1.changeInterfaceToClass, addClassConstructor_1.addClassConstructor, removeConst_1.removeConst];
const fixClassesMainPatch = (ast) => {
    classesToFix.forEach(classFixDescription => {
        const moduleDecleration = (0, utils_1.getSourceFileModule)(ast, classFixDescription.moduleName);
        if (moduleDecleration) {
            ast = classPatches.reduce((patchedAst, patchFunction) => patchFunction({
                ast: patchedAst,
                classFixDescription,
                moduleDecleration,
            }), ast);
        }
    });
    return ast;
};
exports.fixClassesMainPatch = fixClassesMainPatch;
//# sourceMappingURL=main.js.map