// xquery hover

import * as vscode from "vscode";

import { Configuration } from "../common";
import { languageIds } from "../constants";
import { diagnosticCollectionXQuery } from "../extension";

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
        const sctx = linter.getSctx(position);
        const node = linter.getAST(position);
        if (node.name === 'WS') return null;

        let n2 = node;
        const path = [node.name]
        while (n2.getParent !== null) {
            n2 = n2.getParent;
            path.push(n2.name);
        }
        const ps=path.join('/');
        const isfuncall="EQName/FunctionEQName/FunctionCall/";
        const fc=ps.startsWith(isfuncall);
        const parsePath = new vscode.MarkdownString(
            '<a href="https://quodatum.github.io/basex-xqparse/i-BaseX.xhtml#'+path[0]+'">Path:<a>');
        parsePath.appendText(ps);
        parsePath.supportHtml = true;
        parsePath.isTrusted = true;

        return new vscode.Hover([
            `[${position.line},${position.character}] Type: ${node.name}, Word: ${word}`,
            `value: ${node.value}, fc: ${fc}`,
            parsePath
        ]);
    }
}