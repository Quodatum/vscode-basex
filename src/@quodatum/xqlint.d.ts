
declare module '@quodatum/xqlint'{
  import { Position, Range } from "vscode";
    export class  XQLint{
        constructor(source :string, opts? :object);
        public getCompletions(pos :Position): [object];
        public getXQDoc() :XQDoc;
        public getAST(pos? :Position) :any;
        public getSctx(pos? :Position) :any;
        public getErrors() :[Marker];
        public getWarnings() :[Marker];   
    }
// 
    export class Marker{
      pos: LintRange;
      type: string; // error,warning
      level: string; //same as type??
      message: string; // '[code] ...'
    }
  
    export class  LintRange{
      sl: number;
      sc: number;
      el: number;
      ec: number;
    }
    export class  XQDoc{
      moduleNamespace: string;
      description: string;
      variables: [VarDecl];
      functions: [FunDecl];
    }
    export interface VarDecl {
        name: string;
        type: string;
        occurrence?: string;
        description: string;
        pos: any;
    }
      
    export interface FunDecl  {
        name: string;
        arity: number;
        params: string[]; // name
        description: string;
        pos: boolean;
    }   

   export function XQueryLexer() :any;
   export function createStaticContext(processor :string) :any;
   export function CodeFormatter(ast :object) :any;
   export function CodeFormatter(ast :object, newLinesEnabled :boolean, DEBUG :any) :any;

} 