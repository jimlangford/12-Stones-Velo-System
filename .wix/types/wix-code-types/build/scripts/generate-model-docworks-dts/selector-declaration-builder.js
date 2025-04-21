"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const has_1 = __importDefault(require("lodash/has"));
const docworks_dts_1 = __importDefault(require("docworks-dts"));
const constants_1 = __importDefault(require("../constants"));
const wix_code_common_1 = require("@wix/wix-code-common");
const { $W_GLOBAL_COMMENTS, $W_MEMBERS_KEY, QUERYABLE_TYPE } = constants_1.default;
// todo::remove those functions form here asap
const { dtsProperty, dtsObjectTypeAlias, convertTreeToString, } = docworks_dts_1.default.dtsGenerator;
const { convertOperationToFunction } = docworks_dts_1.default.docworksToDtsConverters;
const $W = constants_1.default.$W_MODULE_NAME;
const DECLARE_KEYWORD = "declare";
const find$wService = (services) => {
    return services.find((service) => service.name === $W && !(0, has_1.default)(service, "memberOf"));
};
const getQueryableObjectType = (services) => {
    const isQueryableService = (service) => { var _a; return !!(service.memberOf === $W && ((_a = service.extra) === null || _a === void 0 ? void 0 : _a.queryable)); };
    const queryableServices = services.filter(isQueryableService);
    const properties = queryableServices.map(service => dtsProperty(service.name, `${$W}.${service.name}`));
    return dtsObjectTypeAlias(QUERYABLE_TYPE, properties);
};
const extract$wComments = (services) => {
    const $wService = find$wService(services);
    if (!$wService) {
        throw new Error(`Can't find $w service`);
    }
    const $wOperation = $wService.operations.find(operation => operation.name === $W);
    if (!$wOperation) {
        return undefined;
    }
    const [$w$wMembersComment] = $wService.operations
        .filter(o => o.name === $W)
        .map(operation => operation.docs.summary);
    const { DECLARATION_COMMENT, NAMESPACE_COMMENT, $W_TYPE_DECLARATION_COMMENT, } = $W_GLOBAL_COMMENTS;
    return {
        [DECLARATION_COMMENT]: $wOperation.docs.summary,
        [NAMESPACE_COMMENT]: $wService.docs.summary,
        [$W_TYPE_DECLARATION_COMMENT]: $w$wMembersComment,
    };
};
const extract$wMembers = (services) => {
    const $wService = find$wService(services);
    if (!$wService) {
        throw new Error(`Can't find $w service`);
    }
    const $wMembersOperations = $wService.operations
        .filter(o => o.name !== $W)
        .map(operation => {
        return convertOperationToFunction($wService, operation, {
            documentationGenerator: ({ summary }) => summary,
        });
    });
    return convertTreeToString($wMembersOperations)
        .split(DECLARE_KEYWORD)
        .join("")
        .split("\n")
        .join("\n\t");
};
const declarationBuilder = (services) => {
    const $wComments = extract$wComments(services);
    if (!$wComments) {
        throw new Error(`Can't find $w comments`);
    }
    const $wMembers = extract$wMembers(services);
    const queryableType = getQueryableObjectType(services);
    const page$wTemplate = fs_extra_1.default.readFileSync(path_1.default.join(constants_1.default.TYPE_TEMPLATES_FOLDER, wix_code_common_1.FileContext.Page, constants_1.default.$W_DECLARATION_FULL_FILENAME), "utf-8");
    const page$wWithMembers = page$wTemplate.replace($W_MEMBERS_KEY, $wMembers);
    const page$wFinal = Object.keys($wComments).reduce((dts, commnetKey) => dts.replace(commnetKey, $wComments[commnetKey]), page$wWithMembers);
    return [convertTreeToString({ queryableType }), page$wFinal].join("\n");
};
exports.default = declarationBuilder;
//# sourceMappingURL=selector-declaration-builder.js.map