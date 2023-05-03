// xquery hover

import * as vscode from "vscode";
import { Factory } from "../common/xqlint";
import { Configuration } from "../common";
import {languageIds} from "../constants";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerHoverProvider(
        { language: languageIds.xquery }, new XQueryHoverProvider()
    ));
}
export class XQueryHoverProvider implements vscode.HoverProvider {
    public provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.Hover | null {
        if (!Configuration.xqueryShowHovers(document.uri)) return null;
        const range = document.getWordRangeAtPosition(position);
        if(range.isEmpty) return null
        const word = document.getText(range);
        
        const linter = Factory.XQLint(document);
        const node = linter.getAST(position);
        if(node.name === 'WS') return null;

        let n2=node;
        const path=[node.name]
        while (n2.getParent !== null) {
            n2=n2.getParent;
            path.unshift(n2.name)    
        }
  
        return new vscode.Hover([
            `[${position.line},${position.character}] Type: ${node.name}, Word: ${word}`,
            `value: ${node.value}`,
            `path: ${path.join('/') }`
        ]);
    }
}