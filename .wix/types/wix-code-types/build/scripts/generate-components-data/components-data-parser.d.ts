import * as ts from "typescript";
export type ComponentsData = {
    [name: string]: {
        apiRefLink?: string;
        events: EventHandler[];
    };
};
export interface EventHandler {
    origin: string;
    name: string;
    description: string;
    kind: "function";
    type: string;
    handlerArgs: HandlerArg[];
}
export interface HandlerArg {
    name: string;
    type: string | undefined;
}
type ComponentsDataParser = {
    parse: () => ComponentsData;
};
declare const getComponentsDataParser: (typeChecker: ts.TypeChecker, sourceFile: ts.SourceFile) => ComponentsDataParser;
export default getComponentsDataParser;
//# sourceMappingURL=components-data-parser.d.ts.map