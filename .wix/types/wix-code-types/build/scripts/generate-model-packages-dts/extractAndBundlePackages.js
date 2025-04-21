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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAndBundlePackages = void 0;
const tmp_1 = __importDefault(require("tmp"));
const rollup_1 = require("rollup");
const path_1 = __importDefault(require("path"));
const rollup_plugin_dts_1 = __importDefault(require("rollup-plugin-dts"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const utils_1 = require("../utils");
const utils_2 = require("./utils");
const extractNpmPackage_1 = require("./extractNpmPackage");
const wix_code_common_1 = require("@wix/wix-code-common");
const getRollupPlugins = (autocompleteType) => {
    const plugins = [(0, rollup_plugin_dts_1.default)()];
    if (autocompleteType === wix_code_common_1.AutocompleteType.Stable) {
        plugins.unshift((0, utils_2.dtsStripInternalsPreprocessor)());
    }
    return plugins;
};
const bundlePackageDtsFiles = (typingDtsPath, packagePath, autocompleteType) => __awaiter(void 0, void 0, void 0, function* () {
    const packageName = path_1.default.dirname(packagePath);
    const bundle = yield (0, rollup_1.rollup)({
        input: typingDtsPath,
        plugins: getRollupPlugins(autocompleteType),
        onwarn: e => {
            throw new Error(e === null || e === void 0 ? void 0 : e.message);
        },
    });
    const { output } = yield bundle
        .generate({
        file: path_1.default.join(packagePath, "index.d.ts"),
        format: "es",
    })
        .finally(bundle.close);
    if (output.length === 0) {
        throw new Error(`Failed bundling ${packageName}`);
    }
    return output[0].code;
});
const createModuleDts = (moduleDeclarationName, packagePath, autocompleteType) => __awaiter(void 0, void 0, void 0, function* () {
    const input = (0, utils_2.getWixPackageTypingsPath)(packagePath);
    if (!input) {
        throw new Error(`Couldn't find a typings field in ${packagePath}/package.json`);
    }
    let code;
    try {
        if ((0, utils_2.shouldBundleDts)(input)) {
            code = yield bundlePackageDtsFiles(input, packagePath, autocompleteType);
        }
        else {
            code = fs_extra_1.default.readFileSync(input).toString();
        }
    }
    catch (e) {
        throw new Error(`${moduleDeclarationName}: ${e.message}`);
    }
    const moduleBody = (0, utils_2.removeDeclareFromAmbientModule)(code);
    return (0, utils_2.wrapInAmbientModuleDeclaration)(moduleDeclarationName, moduleBody);
});
const extractAndBundlePackageDts = ({ dest, pkg, type, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = pkg;
    const moduleDeclarationName = (0, utils_1.removeWixNamespaceFromPackage)(name);
    const pkgVersion = type === wix_code_common_1.AutocompleteType.Stable
        ? pkg.autoCompleteVersions.stable
        : pkg.autoCompleteVersions.beta;
    console.log(`Generating ${type} ${moduleDeclarationName}.d.ts`);
    const versionedPkgName = `${name}@${pkgVersion}`;
    const packageDest = yield (0, extractNpmPackage_1.extractNpmPackage)(dest, versionedPkgName);
    const content = yield createModuleDts(moduleDeclarationName, packageDest, type);
    const targetContexts = (0, utils_1.getPKGRelevantTargetContextsFromScopes)(pkg);
    return {
        name: moduleDeclarationName,
        content,
        targetContexts,
        type,
    };
});
const packagesBundleInfoReducer = (dest) => (acc, pkg) => {
    if ((0, utils_2.isBetaPkg)(pkg)) {
        acc.push({
            dest,
            pkg,
            type: wix_code_common_1.AutocompleteType.Beta,
        });
    }
    if ((0, utils_2.isStablePkg)(pkg)) {
        acc.push({
            dest,
            pkg,
            type: wix_code_common_1.AutocompleteType.Stable,
        });
    }
    return acc;
};
const extractAndBundlePackages = (packagesMap) => __awaiter(void 0, void 0, void 0, function* () {
    const tmpDir = tmp_1.default.dirSync();
    const packages = Object.values(packagesMap);
    const packagesBundleInfo = packages.reduce(packagesBundleInfoReducer(tmpDir.name), []);
    const generatedDTSFilesPromises = packagesBundleInfo.map(extractAndBundlePackageDts);
    const generatedDtsFiles = yield Promise.all(generatedDTSFilesPromises);
    console.log("Finished generating typescript declaration files");
    return generatedDtsFiles;
});
exports.extractAndBundlePackages = extractAndBundlePackages;
//# sourceMappingURL=extractAndBundlePackages.js.map