
declare module '@quodatum/xqlint'{
  import { Position} from "vscode";
    export class  XQLint{
        constructor(source :string, opts? :object);
        public getCompletions(pos :Position): [object];
        public getXQDoc(withPos? :boolean) :XQDoc;
        public getAST(pos? :Position) :any;
        public printAST() :string;
        public getSctx(pos? :Position) :any;
        public getErrors() :[Marker];
        public getWarnings() :[Marker];
        public getDocLinks() :[[DocLink]];    
    }
// 
    export class Marker{
      pos: LintRange;
      type: string; // error,warning
      level: string; //same as type??
      message: string; // '[code] ...'
    }
    export class DocLink{
      range: LintRange;
      uri: string; // uri after at    
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
        comments: Comment;
        pos: LintRange;
    }
 
    export interface FunDecl  {
        name: string;
        arity: number;
        params: string[]; // name
        comments: Comment;
        pos: LintRange;
    }   
    export interface Comment {
      description: string;
      params :object;
      errors :string[];
      others :string[];
    }  
   export function XQueryLexer() :any;
   export function createStaticContext(processor :string) :any;
   export function CodeFormatter(ast :object) :any;
   export function CodeFormatter(ast :object, newLinesEnabled :boolean, DEBUG :any) :any;
  
} 