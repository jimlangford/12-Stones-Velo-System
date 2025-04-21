import ts from "typescript";
import { TypeDescription } from "./main";
export interface AllowAnyPropPatchParams {
    ast: ts.SourceFile;
    typeDescription: TypeDescription;
}
export declare const allowAnyPropOnUserInfoType: ({ ast, typeDescription, }: AllowAnyPropPatchParams) => ts.SourceFile;
//# sourceMappingURL=allowAnyPropOnType.d.ts.map