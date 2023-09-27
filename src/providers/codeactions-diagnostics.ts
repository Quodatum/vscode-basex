/*---------------------------------------------------------
 * Copyright (C) Quodatum.
 *--------------------------------------------------------*/

/** To demonstrate code actions associated with Diagnostics problems, this file provides a mock diagnostics entries. */

import * as vscode from 'vscode';
import { channel, unsupportedScheme,isEmpty } from '../common';

/** Code that is used to associate diagnostic entries with code actions. */
export const XQ_ACTION = 'xq_action';



/**
 * Analyzes the text document for problems. 
 * only empty->snippet.
 * @param doc text document to analyze
 * @param xqActionsDiagnostics diagnostic collection
 */
export function refreshDiagnostics(doc: vscode.TextDocument, xqActionsDiagnostics: vscode.DiagnosticCollection): void {
	const diagnostics: vscode.Diagnostic[] = [];
    if(!doc || unsupportedScheme(doc.uri)) return;
    channel.log("action refresh: "+doc.uri.toString());
		if (isEmpty(doc)) {
			diagnostics.push(emptyText());
		}
	xqActionsDiagnostics.set(doc.uri, diagnostics);
}

// create hint
function emptyText():vscode.Diagnostic {
    // create range that represents, where in the document the word is
    const range = new vscode.Range(0, 0, 0, 0);
    const diagnostic = new vscode.Diagnostic(range, "Empty source.",
        vscode.DiagnosticSeverity.Warning);
    diagnostic.code = XQ_ACTION;
    return diagnostic
}

export function subscribeToDocumentChanges(context: vscode.ExtensionContext, xqActionsDiagnostics: vscode.DiagnosticCollection): void {
	if (vscode.window.activeTextEditor) {
		refreshDiagnostics(vscode.window.activeTextEditor.document, xqActionsDiagnostics);
	}
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				refreshDiagnostics(editor.document, xqActionsDiagnostics);
			}
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, xqActionsDiagnostics))
	);

	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument(doc => xqActionsDiagnostics.delete(doc.uri))
	);

}