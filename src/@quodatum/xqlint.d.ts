declare module '@quodatum/xqlint'{
    export function  XQLint(source :string, opts :object) :any;
    export function XQueryLexer() :any;
   export function createStaticContext(processor :string) :any;
   export function CodeFormatter(ast :object) :any;
   export function CodeFormatter(ast :object, newLinesEnabled :boolean, DEBUG :any) :any;

} 