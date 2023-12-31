
'use strict';

import vscode from 'vscode';
import { inspectAst, WhatType, importRange } from "../common";
import { xqLinters } from "../extension";
import { languageIds } from '../constants';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDefinitionProvider(
		{ language: languageIds.xquery }, new XQueryDefinitionProvider()
	));
}

const hasDef = [WhatType.FunctionCall, WhatType.NamedFunctionRef, WhatType.VarRef];
export class XQueryDefinitionProvider implements vscode.DefinitionProvider {

	public provideDefinition(document: vscode.TextDocument, position: vscode.Position,
		token: vscode.CancellationToken): vscode.Definition | Thenable<vscode.Definition> {
		const linter = xqLinters.xqlint(document.uri);
		const what = inspectAst(linter, position);
		if (!hasDef.includes(what.type)) return undefined;
		const thisns = linter.getXQDoc().ns;
		let targetDoc;
		if (thisns === what.qname.uri) { //in current doc
			targetDoc = document.uri;
		} else {
			const doclink = linter.getDocLinks().find(d => d.ns === what.qname.uri);
			if (doclink) targetDoc = vscode.Uri.file(doclink.path);
		}
		if (!targetDoc) return undefined;
		const range = importRange(what.get.pos);
		return new vscode.Location(targetDoc, range.start);
	}
}