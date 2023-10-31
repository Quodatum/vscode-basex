// xquery hover

import * as vscode from "vscode";

import { Configuration ,inspectAst } from "../common";
import { languageIds } from "../constants";
import { diagnosticCollectionXQuery } from "../extension";
import { XQLint } from '@quodatum/xqlint';


export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerHoverProvider(
        { language: languageIds.xquery }, new XQueryHoverProvider()
    ));
}
class XQueryHoverProvider implements vscode.HoverProvider {
    public provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.Hover | null {
        if (!Configuration.xqueryShowHovers()) return null;
        const range = document.getWordRangeAtPosition(position);
        if (!range) return null
        const word = document.getText(range);
        const linter =   diagnosticCollectionXQuery.xqlint(document.uri);     
        const x=inspectAst(linter,position);
        if (x.type==='WS') return null;
        const parsePath = new vscode.MarkdownString(
            '<a href="https://quodatum.github.io/basex-xqparse/i-BaseX.xhtml#'+x.path[0]+'">Path:<a>');
        parsePath.appendText(x.path.join("/"));
        parsePath.supportHtml = true;
        parsePath.isTrusted = true;

        return new vscode.Hover([
            `[${position.line},${position.character}] Type: ${x.name}, Word: ${word}`,
            `value: ${x.value}, type: ${ x.type}`,
            parsePath
        ]);
    }
}
