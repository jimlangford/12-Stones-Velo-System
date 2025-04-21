import ts from "typescript";
import { ModuleDeclarationWithModuleBlock } from "../utils";
export interface ClassFixDescription {
    moduleName: string;
    name: string;
    constName: string;
}
interface ClassPatchFunctionParams {
    ast: ts.SourceFile;
    classFixDescription: ClassFixDescription;
    moduleDecleration: ModuleDeclarationWithModuleBlock;
}
export type ClassPatchFunction = (patchParams: ClassPatchFunctionParams) => ts.SourceFile;
export declare const fixClassesMainPatch: (ast: ts.SourceFile) => ts.SourceFile;
export {};
//# sourceMappingURL=main.d.ts.map