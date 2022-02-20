// format xquery
import { channel } from "../common/logger";
import { XQLint, CodeFormatter } from "@quodatum/xqlint";


export class XQueryFormatter {
    static format(xquery: string): string {
        channel.log("XQueryFormatter");
        const linter = new (XQLint as any)(xquery, { "styleCheck": false });
        channel.appendLine("got linter: " + linter.hasSyntaxError());
        //if(linter.hasSyntaxError()+linter.hasSyntaxError()) throw new Error("XQuery syntax error")
        const ast = linter.getAST()
        const formatter = new (CodeFormatter as any)(ast);
        const formatted = formatter.format().trim();
        channel.log("XQueryFormatter done");
        return formatted;
    }
}
