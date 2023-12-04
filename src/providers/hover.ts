// xquery hover

import * as vscode from "vscode";

import { Configuration, inspectAst, markdownString } from "../common";
import { languageIds } from "../constants";
import { xqLinters } from "../extension";



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
       
        const range = document.getWordRangeAtPosition(position);
        if (!range) return null
        const word = document.getText(range);
        const linter = xqLinters.xqlint(document.uri);
        const what = inspectAst(linter, position);
        if (what.type === 'WS') return null;

        const hovers:vscode.MarkdownString[]=[
            what.display?markdownString("**"+what.display+"**"):null,
            markdownString(what.get?.description)
        ];

        if (Configuration.xqueryShowHovers()) {
            const parsePath = markdownString(
                '<a href="https://quodatum.github.io/basex-xqparse/i-BaseX.xhtml#' + what.path[0] + '">Path:<a>');
            parsePath.appendText(what.path.join("/"));
            const debugInfo=`[${position.line},${position.character}] Word: ${word},
            value: ${what.value}, type: ${what.type}`;
            hovers.push(markdownString(debugInfo));
            hovers.push( parsePath);
        }
        return new vscode.Hover(hovers);
    }
}
