import * as ts from "typescript";
interface CompilerSourceFile {
    fileName: string;
    content: string;
    sourceFile?: ts.SourceFile;
}
export declare const createCompilerHostForFile: (file: CompilerSourceFile) => ts.CompilerHost;
export declare const getModuleDeclarationBody: (moduleDeclaration: ts.ModuleDeclaration | undefined) => ts.ModuleBlock | undefined;
export declare const getStatementByInterfaceName: (rootModuleBlock: ts.ModuleBlock, interfaceName: string) => ts.InterfaceDeclaration | undefined;
export declare const getTypeNodeByName: (rootModuleBlock: ts.ModuleBlock, typeName: string) => ts.TypeAliasDeclaration | undefined;
export declare const getTypeEntityName: (entityName: ts.EntityName) => string;
export declare const getMethodParameterTypeDeclaration: (rootModuleBlock: ts.ModuleBlock, methodSignature: ts.MethodSignature) => ts.TypeAliasDeclaration | undefined;
export declare const isFunctionTypeNodeWithParameters: (typeNode: ts.TypeNode) => typeNode is ts.FunctionTypeNode;
export declare const getBaseClassesNames: (node: ts.InterfaceDeclaration) => string[];
export {};
//# sourceMappingURL=utils.d.ts.map