
/** To demonstrate code actions associated with Diagnostics problems */
import * as vscode from 'vscode';

import { channel, unsupportedScheme } from "../common";
/** Code that is used to associate diagnostic entries with code actions. */
export const XQ_ACTION = 'xq_action';
  
export function activate(context: vscode.ExtensionContext,actionDiagnostics:vscode.DiagnosticCollection) {
  channel.log("Actions activate");
  subscribeToDocumentChanges(context,actionDiagnostics);
}

/**
 * Analyzes the text document for problems. 
 * if empty do action
 * @param doc text document to analyze
 * @param actionDiagnostics diagnostic collection
 */
function refreshDiagnostics(doc: vscode.TextDocument, actionDiagnostics: vscode.DiagnosticCollection): void {
    let diagnostics: vscode.Diagnostic[] ;
    if(!doc || unsupportedScheme(doc.uri)) return;
    channel.log("action refresh: "+doc.uri.toString());
    if (doc.getText() === "") {
        diagnostics.push(emptyText());      
    }
    actionDiagnostics.set(doc.uri,diagnostics);
}

// create hint
function emptyText():vscode.Diagnostic {
    // create range that represents, where in the document the word is
    const range = new vscode.Range(0, 0, 0, 0);
    const diagnostic = new vscode.Diagnostic(range, "Run template?",
        vscode.DiagnosticSeverity.Information);
    diagnostic.code = XQ_ACTION;
    return diagnostic
}

function subscribeToDocumentChanges(context: vscode.ExtensionContext, actionDiagnostics: vscode.DiagnosticCollection): void {
    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, actionDiagnostics);
    }
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                refreshDiagnostics(editor.document, actionDiagnostics);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, actionDiagnostics))
    );

    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(doc => actionDiagnostics.delete(doc.uri))
    );

}