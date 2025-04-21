import { RuntimeScope, WixCodeTypesModel, WixPackage } from "@wix/wix-code-common";
type WixSdk = {
    name: string;
    scopes: RuntimeScope[];
};
type WixSdksMap = {
    [name: string]: WixSdk;
};
type WixSdksModel = {
    packages: WixSdksMap;
};
export type WixPackagesMap = {
    [name: string]: WixPackage;
};
export declare const getWixCodeTypesModel: () => WixCodeTypesModel;
export declare const getWixCodeTypesSdkModel: () => WixSdksModel;
export declare const getNonDeprecatedModules: () => string[];
declare const _default: {
    getWixCodeTypesModel: () => WixCodeTypesModel;
    getWixCodeTypesSdkModel: () => WixSdksModel;
    getNonDeprecatedModules: () => string[];
};
export default _default;
//# sourceMappingURL=model.d.ts.map