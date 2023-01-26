declare module '@quodatum/xqlint'{
    export class  XQLint{
        constructor(source :string, opts? :object);
        public getCompletions(pos :object): [object];
        public getXQDoc() :XQDoc; 
    }
    export interface VarType {
        name: string;
        pos: any;
      }
      
    export interface FunType  {
        name: string;
        params: string[]; // name
        pos: boolean;
      }   
    export class  XQDoc{
        moduleNamespace: string;
        description: string;
        variables: [VarType];
        functions: [FunType];
    }
   export function XQueryLexer() :any;
   export function createStaticContext(processor :string) :any;
   export function CodeFormatter(ast :object) :any;
   export function CodeFormatter(ast :object, newLinesEnabled :boolean, DEBUG :any) :any;

} 