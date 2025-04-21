#!/usr/bin/env node
import { FileContext } from "@wix/wix-code-common";
export type FileContextUppercase = Uppercase<FileContext.Backend> | Uppercase<FileContext.Public> | Uppercase<FileContext.Page>;
export type DeclarationFile = {
    path: string;
    content: string;
};
export type ContextsMap = {
    [T in FileContextUppercase]: string[];
};
export type FullWixCodeTypesJSON = {
    libs: DeclarationFile[];
    contexts: ContextsMap;
};
//# sourceMappingURL=main.d.ts.map