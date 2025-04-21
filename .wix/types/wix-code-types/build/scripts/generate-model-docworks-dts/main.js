#!/usr/bin/env node
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
const modelGenerators_1 = require("./modelGenerators");
const clone_docs_repo_1 = __importDefault(require("./clone-docs-repo"));
const utils_1 = require("../utils");
const runGenerateDocworksDeclarations = () => __awaiter(void 0, void 0, void 0, function* () {
    const localDocsRepoPath = process.env.LOCAL_DOCS_REPO_PATH || (0, clone_docs_repo_1.default)();
    const modelGenerators = (0, modelGenerators_1.getModelGenerators)(localDocsRepoPath);
    for (const generator of modelGenerators) {
        yield generator();
    }
});
if (require.main === module) {
    (0, utils_1.runAsyncScript)(runGenerateDocworksDeclarations);
}
//# sourceMappingURL=main.js.map