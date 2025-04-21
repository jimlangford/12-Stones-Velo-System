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
exports.copyNodeTypes = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const constants_1 = __importDefault(require("../constants"));
const copyNodeTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    const nodeTypesFolder = (0, path_1.dirname)(require.resolve("@types/node/package.json"));
    fs_extra_1.default.copySync(nodeTypesFolder, constants_1.default.TYPES_NODE_PATH);
});
exports.copyNodeTypes = copyNodeTypes;
if (require.main === module) {
    (0, exports.copyNodeTypes)();
}
//# sourceMappingURL=main.js.map