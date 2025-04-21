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
const selector_declaration_builder_1 = __importDefault(require("./selector-declaration-builder"));
// eslint-disable-next-line
const docworksRepo = require("docworks-repo");
const generate$wdtsFile = (docsPath, $wDtsFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`reading docs from local source ${docsPath}`);
    const repo = yield docworksRepo.readFromDir(docsPath);
    const $wDeclarationContent = yield (0, selector_declaration_builder_1.default)(repo.services);
    fs_1.default.writeFileSync($wDtsFilePath, $wDeclarationContent);
    console.log(`selector dts saved to file ${$wDtsFilePath}`);
});
exports.default = generate$wdtsFile;
//# sourceMappingURL=selector-declaration-generator.js.map