/* eslint-disable @typescript-eslint/no-unused-vars */
// format xquery
import { XQLint, CodeFormatter } from "@quodatum/xqlint";
import { CancellationToken, DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider,
         FormattingOptions, ProviderResult,Range,
         TextDocument, TextEdit} from "vscode";

import { channel } from "../common/logger";

function format(xquery: string,document: TextDocument): string {
    channel.log("XQueryFormatter" + document.uri);
    const linter = new (XQLint as any)(xquery, { "styleCheck": false });
    channel.appendLine(" linter hasSyntaxError: " + linter.hasSyntaxError());
    //if(linter.hasSyntaxError()+linter.hasSyntaxError()) throw new Error("XQuery syntax error")
    const ast = linter.getAST()
    const formatter = new (CodeFormatter as any)(ast);
    const formatted = formatter.format().trim();
    channel.log("XQueryFormatter done");
    return formatted;
}
export class XQueryFormatter implements DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider{
    provideDocumentFormattingEdits(document: TextDocument, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]> {
        const lastLine = document.lineAt(document.lineCount - 1);
        const documentRange = new Range(document.positionAt(0), lastLine.range.end);
        return this.provideDocumentRangeFormattingEdits(document, documentRange, options, token);
    }

    provideDocumentRangeFormattingEdits(document: TextDocument, range: Range, _options: FormattingOptions, _token: CancellationToken): ProviderResult<TextEdit[]> {
        const selected = document.getText(range);
        const result = format(selected, document);
        return [TextEdit.replace(range, result)];
    }
}
