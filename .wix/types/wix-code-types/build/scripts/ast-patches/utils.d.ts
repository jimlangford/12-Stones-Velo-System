import ts from "typescript";
export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
};
export interface ModuleDeclarationWithModuleBlock extends ts.ModuleDeclaration {
    body: ts.ModuleBlock;
}
export declare const is$wModule: (statement: ts.Statement) => statement is ModuleDeclarationWithModuleBlock;
export declare const isGlobalModule: (statement: ts.Statement) => statement is ModuleDeclarationWithModuleBlock;
export declare const isMixinInterface: (statement: ts.Statement, mixinName: string) => statement is ts.InterfaceDeclaration;
export declare const isInterfaceMixinMember: (member: ts.TypeElement, name: string) => member is ts.PropertySignature;
export declare const fetch$wModuleFromGlobal: (statement: ModuleDeclarationWithModuleBlock) => ModuleDeclarationWithModuleBlock | undefined;
export declare const get$wModule: (ast: ts.SourceFile) => ModuleDeclarationWithModuleBlock | undefined;
export declare const getSourceFileModule: (ast: ts.SourceFile, moduleName: string) => Possible<ModuleDeclarationWithModuleBlock>;
//# sourceMappingURL=utils.d.ts.map