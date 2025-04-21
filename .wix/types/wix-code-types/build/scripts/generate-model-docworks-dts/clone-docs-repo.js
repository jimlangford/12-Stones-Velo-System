#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmp_1 = __importDefault(require("tmp"));
const child_process_1 = require("child_process");
const constants_1 = __importDefault(require("../constants"));
const utils_1 = require("./utils");
const DOCS_BRANCH = process.env.DOCS_BRANCH;
const cloneDocsRepo = () => {
    const tmpDir = tmp_1.default.dirSync();
    const commandOptions = ["clone", constants_1.default.WIX_CODE_DOCS_REMOTE, tmpDir.name];
    if (DOCS_BRANCH) {
        commandOptions.splice(1, 0, "--single-branch", "--branch", DOCS_BRANCH);
        console.info(`Building definitions based on ${DOCS_BRANCH} branch`);
    }
    const { error: cloneError } = (0, child_process_1.spawnSync)("git", commandOptions, {
        stdio: "inherit",
    });
    if (cloneError) {
        throw cloneError;
    }
    const { error: checkoutError } = (0, child_process_1.spawnSync)("git", ["checkout", (0, utils_1.getDocworksCommitId)()], {
        stdio: "inherit",
        cwd: tmpDir.name,
    });
    if (checkoutError) {
        throw checkoutError;
    }
    return tmpDir.name;
};
exports.default = cloneDocsRepo;
//# sourceMappingURL=clone-docs-repo.js.map