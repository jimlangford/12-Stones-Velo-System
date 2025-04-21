import { FileContext } from "@wix/wix-code-common";
interface Operation {
    name: string;
    docs: {
        summary: string;
    };
}
export interface DocworksService {
    name: string;
    displayName?: string;
    docs: {
        summary: string;
    };
    operations: Operation[];
    extra?: {
        [anyKey: string]: string | string[];
    };
    memberOf: string;
}
export type WixModulesMap = {
    [key in FileContext]: string[];
};
export {};
//# sourceMappingURL=main.d.ts.map