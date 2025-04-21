"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowAnyPropOn_wEventTarget_1 = require("./allowAnyPropOn$wEventTarget");
const allowAnyPropOnContainerChildren_1 = require("./allowAnyPropOnContainerChildren");
const allowAnyPropOnPlayableMixinNextPrevious_1 = require("./allowAnyPropOnPlayableMixinNextPrevious");
const changeWixAuthElevateFunctionType_1 = require("./changeWixAuthElevateFunctionType");
const main_1 = require("./fixClassPatch/main");
const main_2 = require("./allowAnyPropOnType/main");
const astPatches = [
    allowAnyPropOn_wEventTarget_1.allowAnyPropOn$wEventTarget,
    allowAnyPropOnContainerChildren_1.allowAnyPropOnContainerChildren,
    allowAnyPropOnPlayableMixinNextPrevious_1.allowAnyPropOnPlayableMixinNextPrevious,
    changeWixAuthElevateFunctionType_1.changeWixAuthElevateFunctionType,
    main_1.fixClassesMainPatch,
    main_2.allowAnyPropOnTypes,
];
exports.default = astPatches;
//# sourceMappingURL=patches.js.map