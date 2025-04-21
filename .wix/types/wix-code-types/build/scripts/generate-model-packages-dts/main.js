"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGenerateWixPackages = void 0;
const model_1 = require("../model");
const writeBundledPackages_1 = require("./writeBundledPackages");
const extractAndBundlePackages_1 = require("./extractAndBundlePackages");
const utils_1 = require("./utils");
const utils_2 = require("../utils");
const runGenerateWixPackages = (typesDest) => __awaiter(void 0, void 0, void 0, function* () {
    const model = (0, model_1.getWixCodeTypesModel)();
    const bundledDtsFiles = yield (0, extractAndBundlePackages_1.extractAndBundlePackages)(model.packages);
    (0, writeBundledPackages_1.writeBundledPackages)(typesDest, bundledDtsFiles);
});
exports.runGenerateWixPackages = runGenerateWixPackages;
if (require.main === module) {
    (0, utils_2.runAsyncScript)(() => (0, exports.runGenerateWixPackages)((0, utils_1.getTypesDest)()));
}
//# sourceMappingURL=main.js.map