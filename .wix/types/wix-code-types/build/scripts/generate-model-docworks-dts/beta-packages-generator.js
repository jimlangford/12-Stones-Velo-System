"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const constants_1 = __importDefault(require("../constants"));
const utils_1 = require("../generate-model-packages-dts/utils");
const utils_2 = require("../utils");
const utils_3 = require("./utils");
const generateBetaCommonPackages = () => {
    const generatedStableTripleReferencesContent = fs_extra_1.default.readFileSync(path_1.default.resolve(__dirname, "../../", constants_1.default.DOCWORKS_DTS_COMMON_PATH), "utf8");
    const stableDocworksPackagesTripleReferences = generatedStableTripleReferencesContent.split("\n");
    const stablePackagesNames = (0, utils_2.extractPkgNamesFromTripleReferences)(stableDocworksPackagesTripleReferences);
    const betaOnlyWixPackagesNames = (0, utils_3.getBetaOnlyWixPackages)();
    const onlyStableDocworksPackages = stablePackagesNames.filter((0, utils_2.onlyStable)(betaOnlyWixPackagesNames));
    fs_extra_1.default.writeFileSync(path_1.default.resolve(__dirname, "../../", constants_1.default.DOCWORKS_DTS_COMMON_BETA_PATH), onlyStableDocworksPackages
        .map(pkgName => (0, utils_1.createTripleReference)(`../../common/${pkgName}`))
        .join("\n"));
};
exports.default = generateBetaCommonPackages;
//# sourceMappingURL=beta-packages-generator.js.map