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
exports.extractNpmPackage = void 0;
const pacote_1 = __importDefault(require("pacote"));
const path_1 = __importDefault(require("path"));
const constants_1 = __importDefault(require("../constants"));
const extractNpmPackage = (dest, versionedPkgName) => __awaiter(void 0, void 0, void 0, function* () {
    const packageDest = path_1.default.join(dest, versionedPkgName);
    yield pacote_1.default.extract(versionedPkgName, packageDest, {
        registry: constants_1.default.WIX_PRIVATE_NPM_REGISTRY,
    });
    return packageDest;
});
exports.extractNpmPackage = extractNpmPackage;
//# sourceMappingURL=extractNpmPackage.js.map