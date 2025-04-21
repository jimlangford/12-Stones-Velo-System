#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const constants_1 = __importDefault(require("../constants"));
const utils_1 = require("./utils");
const WIX_CODE_DOCS_API_URL = "https://www.wix.com/corvid/reference";
const WIX_CODE_DOCS_TEMPLATE = `<%= model.summary %>\n\t[Read more](${WIX_CODE_DOCS_API_URL}/<%= model.service %>.html#<%= model.member %>)<%  if (model.eventType) { %> \n <% print("@eventType " + model.eventType); } %>`;
const removeDtsExtention = (filename) => filename.replace(".d.ts", "");
const runDocworks = (localDocsRepoPath) => {
    const modulesToIgnore = (0, utils_1.getDocworksModulesToIgnore)();
    const docworksDtsOptions = [
        "dts",
        "--local",
        localDocsRepoPath,
        "--out",
        removeDtsExtention(constants_1.default.DOCWORKS_DTS_FILENAME),
        "--dir",
        constants_1.default.TYPES_COMMON_PATH,
        "--multipleFiles",
        "--wixselector",
        "--summaryTemplate",
        WIX_CODE_DOCS_TEMPLATE,
        ...modulesToIgnore
            .map((m2i) => ["--ignoreModule", m2i])
            .flat(),
    ];
    (0, child_process_1.spawnSync)("docworks", docworksDtsOptions, {
        stdio: "inherit",
    });
};
exports.default = runDocworks;
//# sourceMappingURL=run-docworks.js.map