"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const constants_1 = __importDefault(require("../constants"));
const components_data_generator_1 = __importDefault(require("./components-data-generator"));
const runGenerateComponentHandlers = () => {
    const ROOT_DIR = "../../";
    const OUTPUT_PATH = path_1.default.join(__dirname, ROOT_DIR, constants_1.default.DEST_JSONS_PATH, constants_1.default.COMPONENTS_DATA_JSON_FILENAME);
    const DECLARATIONS_DTS_PATH = path_1.default.join(__dirname, ROOT_DIR, constants_1.default.TYPES_COMMON_PATH, constants_1.default.$W_DECLARATION_FULL_FILENAME);
    const generatedEvents = (0, components_data_generator_1.default)(DECLARATIONS_DTS_PATH);
    fs_extra_1.default.ensureFileSync(OUTPUT_PATH);
    fs_extra_1.default.writeFileSync(OUTPUT_PATH, JSON.stringify(generatedEvents));
};
runGenerateComponentHandlers();
//# sourceMappingURL=main.js.map