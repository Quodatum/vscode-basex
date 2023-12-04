
'use strict';

import vscode from 'vscode';
import { inspectAst, WhatType ,importRange} from "../common";
import { xqLinters } from "../extension";
import { languageIds } from '../constants';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(
        { language: languageIds.xquery }, new XQueryDefinitionProvider()
    ));
}
const hasDef=[WhatType.FunctionCall,WhatType.VarRef];
export class XQueryDefinitionProvider implements vscode.DefinitionProvider {

	public provideDefinition(document: vscode.TextDocument, position: vscode.Position,
		token: vscode.CancellationToken): vscode.Definition | Thenable<vscode.Definition> {
		const linter = xqLinters.xqlint(document.uri);
		const what = inspectAst(linter, position);
		if (! hasDef.includes(what.type)) return undefined;
        const range=importRange(what.get.pos);
		return  new vscode.Location(document.uri, range.start);
	}
}