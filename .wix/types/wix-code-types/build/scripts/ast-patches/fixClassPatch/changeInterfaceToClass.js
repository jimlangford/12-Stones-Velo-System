"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeInterfaceToClass = void 0;
const typescript_1 = __importDefault(require("typescript"));
const isRelevantInterface = (interfaceName) => (statement) => typescript_1.default.isInterfaceDeclaration(statement) &&
    statement.name.escapedText === interfaceName;
const changeInterfaceToClass = ({ ast, classFixDescription, moduleDecleration, }) => {
    var _a;
    const relevantInterface = (_a = moduleDecleration.body) === null || _a === void 0 ? void 0 : _a.statements.find(isRelevantInterface(classFixDescription.name));
    if (!relevantInterface) {
        return ast;
    }
    relevantInterface.kind = typescript_1.default.SyntaxKind.ClassDeclaration;
    return ast;
};
exports.changeInterfaceToClass = changeInterfaceToClass;
//# sourceMappingURL=changeInterfaceToClass.js.map