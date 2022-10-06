declare module '@quodatum/xqlint'{
    export class  XQLint{
        constructor(source :string, opts? :object);
        public getCompletions(pos :object): [object];
        public getXQDoc() :XQdoc; 
    }
    export class  XQDoc{
        moduleNamespace: string;
        description: string;
        variables: [object];
        functions: [object];
    }
    export function XQueryLexer() :any;
   export function createStaticContext(processor :string) :any;
   export function CodeFormatter(ast :object) :any;
   export function CodeFormatter(ast :object, newLinesEnabled :boolean, DEBUG :any) :any;

} 