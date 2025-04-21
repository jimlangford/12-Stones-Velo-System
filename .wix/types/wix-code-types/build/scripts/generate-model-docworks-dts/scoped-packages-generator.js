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
const fs_1 = __importDefault(require("fs"));
const docworks_repo_1 = __importDefault(require("docworks-repo"));
const wix_code_common_1 = require("@wix/wix-code-common");
const constants_1 = __importDefault(require("../constants"));
const utils_1 = require("./utils");
const utils_2 = require("../generate-model-packages-dts/utils");
const IGNORED_SCOPED_MODULES_NAMES = [
    constants_1.default.$W_MODULE_NAME,
    ...(0, utils_1.getDocworksModulesToIgnore)(),
];
const isRelevantModule = (service) => {
    return !IGNORED_SCOPED_MODULES_NAMES.includes(service.name) && !(service.displayName && IGNORED_SCOPED_MODULES_NAMES.includes(service.displayName));
};
const isRootService = (service) => !service.memberOf;
const isScopedService = (service) => { var _a; return !!((_a = service === null || service === void 0 ? void 0 : service.extra) === null || _a === void 0 ? void 0 : _a.scopes); };
const filterServiceByType = (autoCompleteType, betaOnlyPackages) => (service) => {
    let shouldFilter;
    if (autoCompleteType === wix_code_common_1.AutocompleteType.Stable) {
        shouldFilter = true;
    }
    else if (!betaOnlyPackages.includes(resolveName(service))) {
        shouldFilter = true;
    }
    else {
        shouldFilter = false;
    }
    return shouldFilter;
};
const getTripleSlashDirectiveForService = (service, autoCompleteType) => {
    const typesRoot = autoCompleteType === wix_code_common_1.AutocompleteType.Stable ? "../" : "../../";
    return (0, utils_2.createTripleReference)(`${typesRoot}${constants_1.default.DEST_TYPES_DIR_COMMON}/${resolveName(service)}`);
};
const resolveName = (service) => {
    return service.name === constants_1.default.$W_MODULE_NAME || !service.displayName ? service.name : service.displayName;
};
const getRootServices = (docsPath, autoCompleteType) => __awaiter(void 0, void 0, void 0, function* () {
    const repo = yield docworks_repo_1.default.readFromDir(docsPath);
    const relevantRootServices = repo.services
        .filter(isRootService)
        .filter(isRelevantModule)
        .filter(filterServiceByType(autoCompleteType, (0, utils_1.getBetaOnlyWixPackages)()));
    return { relevantRootServices };
});
const getTripleSlashDirectivesByContext = (relevantRootServices, autoCompleteType) => {
    const pagesTripleSlashDirectives = [];
    const backendTripleSlashDirectives = [];
    relevantRootServices.forEach((service) => {
        var _a;
        const serviceTripleReference = getTripleSlashDirectiveForService(service, autoCompleteType);
        if (isScopedService(service)) {
            (_a = service.extra.scopes) === null || _a === void 0 ? void 0 : _a.forEach((scope) => {
                scope === wix_code_common_1.RuntimeScope.Frontend
                    ? pagesTripleSlashDirectives.push(serviceTripleReference)
                    : backendTripleSlashDirectives.push(serviceTripleReference);
            });
        }
        else {
            pagesTripleSlashDirectives.push(serviceTripleReference);
            backendTripleSlashDirectives.push(serviceTripleReference);
        }
    });
    return { pagesTripleSlashDirectives, backendTripleSlashDirectives };
};
const writeDirectivesToDTSFiles = ({ pagesTripleSlashDirectives, backendTripleSlashDirectives, typesPath, }) => {
    fs_1.default.writeFileSync((0, utils_1.getDocworksDTSFolderPath)(typesPath, wix_code_common_1.FileContext.Page), pagesTripleSlashDirectives.join("\n"));
    fs_1.default.writeFileSync((0, utils_1.getDocworksDTSFolderPath)(typesPath, wix_code_common_1.FileContext.Backend), backendTripleSlashDirectives.join("\n"));
};
const generateScopedPackagesForType = (docsPath, typesPathRoot, autoCompleteType) => __awaiter(void 0, void 0, void 0, function* () {
    const { relevantRootServices } = yield getRootServices(docsPath, autoCompleteType);
    const typesPath = autoCompleteType === wix_code_common_1.AutocompleteType.Stable
        ? typesPathRoot
        : `${typesPathRoot}/${constants_1.default.DEST_BETA_TYPES_DIR}`;
    const { pagesTripleSlashDirectives, backendTripleSlashDirectives, } = getTripleSlashDirectivesByContext(relevantRootServices, autoCompleteType);
    writeDirectivesToDTSFiles({
        pagesTripleSlashDirectives,
        backendTripleSlashDirectives,
        typesPath,
    });
});
const scopedPackagesGenerator = (docsPath, typesPathRoot) => __awaiter(void 0, void 0, void 0, function* () {
    for (const autoCompleteType of Object.values(wix_code_common_1.AutocompleteType)) {
        yield generateScopedPackagesForType(docsPath, typesPathRoot, autoCompleteType);
    }
});
exports.default = scopedPackagesGenerator;
//# sourceMappingURL=scoped-packages-generator.js.map