/* eslint-disable @typescript-eslint/no-var-requires */

const XQLint =require("@quodatum/xqlint").XQLint;
const CodeFormatter=require( "@quodatum/xqlint").CodeFormatter;
console.log("....");
const xquery="2 +4 ";
const linter = new XQLint(xquery, { "styleCheck": false }) ;

//if(linter.hasSyntaxError()+linter.hasSyntaxError()) throw new Error("XQuery syntax error")
const ast=linter.getAST()
const formatter = new CodeFormatter(ast);
const formatted = formatter.format().trim();
console.log(formatted);