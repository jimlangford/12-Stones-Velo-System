"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeBundledPackages = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const constants_1 = __importDefault(require("../constants"));
const utils_1 = require("./utils");
const wix_code_common_1 = require("@wix/wix-code-common");
const utils_2 = require("../utils");
const writePackagesFiles = (destDir, bundledPackages) => {
    bundledPackages.forEach(({ type, name, content }) => {
        const outputDtsPath = path_1.default.join(destDir, (0, utils_2.maybeBetaPath)(type), constants_1.default.DEST_TYPES_DIR_COMMON, `${name}.d.ts`);
        fs_extra_1.default.ensureFileSync(outputDtsPath);
        fs_extra_1.default.writeFileSync(outputDtsPath, content);
    });
};
const createTripleReferenceStructureMap = (bundledPackages) => {
    const tripleReferenceTypesStructureMapInitValue = (0, utils_1.getEmptyTripleReferenceTypesMap)();
    const tripleReferenceTypesStructureMap = bundledPackages.reduce((soFar, { targetContexts, name, type }) => {
        soFar[type][constants_1.default.DEST_TYPES_DIR_COMMON].push({
            lib: name,
            tripleReference: (0, utils_1.createTripleReference)(`./${name}`),
        });
        for (const targetContext of targetContexts) {
            soFar[type][targetContext].push({
                lib: name,
                tripleReference: (0, utils_1.createTripleReference)(`../${constants_1.default.DEST_TYPES_DIR_COMMON}/${name}`),
            });
        }
        return soFar;
    }, tripleReferenceTypesStructureMapInitValue);
    return tripleReferenceTypesStructureMap;
};
const addMissingStablePackagesToBeta = (tripleReferenceMap) => {
    const updatedTripleReferenceMap = Object.assign({}, tripleReferenceMap);
    Object.entries(updatedTripleReferenceMap.beta).forEach(([dest, betaLibsAndTripleReferences]) => {
        const stableLibsAndTripleReferences = updatedTripleReferenceMap.stable[dest];
        const betaLibNames = betaLibsAndTripleReferences.map(betaLibsAndTripleReference => betaLibsAndTripleReference.lib);
        for (const libAndTripleReference of stableLibsAndTripleReferences) {
            if (!betaLibNames.includes(libAndTripleReference.lib)) {
                betaLibsAndTripleReferences.push(Object.assign(Object.assign({}, libAndTripleReference), { tripleReference: (0, utils_1.createTripleReference)(`../../${constants_1.default.DEST_TYPES_DIR_COMMON}/${libAndTripleReference.lib}`) }));
            }
        }
    });
    return updatedTripleReferenceMap;
};
const generateTripleReferences = (destDir, tripleReferenceMap) => {
    Object.entries(tripleReferenceMap).forEach(([type, targetContexts]) => {
        Object.entries(targetContexts).forEach(([dest, libsAndTripleReferences]) => {
            const tripleSlashDirectives = libsAndTripleReferences.map(libsAndTripleReference => libsAndTripleReference.tripleReference);
            const packageDts = path_1.default.join(destDir, type === wix_code_common_1.AutocompleteType.Beta ? constants_1.default.DEST_BETA_TYPES_DIR : "", dest, constants_1.default.WIX_PACKAGES_DTS_FILENAME);
            fs_extra_1.default.ensureFileSync(packageDts);
            fs_extra_1.default.writeFileSync(packageDts, tripleSlashDirectives.join("\n"));
        });
    });
};
const writeTripleReferences = (destDir, bundledPackages) => {
    let tripleReferenceMap = createTripleReferenceStructureMap(bundledPackages);
    tripleReferenceMap = addMissingStablePackagesToBeta(tripleReferenceMap);
    generateTripleReferences(destDir, tripleReferenceMap);
};
const writeBundledPackages = (destDir, bundledPackages) => {
    writePackagesFiles(destDir, bundledPackages);
    writeTripleReferences(destDir, bundledPackages);
};
exports.writeBundledPackages = writeBundledPackages;
//# sourceMappingURL=writeBundledPackages.js.map