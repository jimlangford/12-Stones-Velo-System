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
exports.runCopyTypeTemplates = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const constants_1 = __importDefault(require("../constants"));
const runCopyTypeTemplates = () => __awaiter(void 0, void 0, void 0, function* () {
    fs_extra_1.default.removeSync(constants_1.default.DEST_TYPES_PATH);
    fs_extra_1.default.copySync(constants_1.default.TYPE_TEMPLATES_FOLDER, constants_1.default.DEST_TYPES_PATH);
});
exports.runCopyTypeTemplates = runCopyTypeTemplates;
if (require.main === module) {
    (0, exports.runCopyTypeTemplates)();
}
//# sourceMappingURL=main.js.map