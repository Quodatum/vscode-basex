import * as vscode from 'vscode';
import * as constants from "./constants";
import { XQLint } from '@quodatum/xqlint';
import { XQueryLinter } from "./linting";
import { channel } from "./common";

// DiagnosticCollection for XQuery documents
export class XQueryDiagnostics implements vscode.DiagnosticCollection,
    Iterable<[uri: vscode.Uri, diagnostics: readonly vscode.Diagnostic[]]>
{
    diagnosticCollectionXQuery: vscode.DiagnosticCollection;
    xqlintCollectionXQuery: Map<vscode.Uri, XQLint>;

    constructor() {
        this.diagnosticCollectionXQuery = vscode.languages.createDiagnosticCollection(constants.diagnosticCollections.xquery);
        this.xqlintCollectionXQuery = new Map();
        channel.log("xqueryDiagnostics new");
    }


    get name() {
        return this.diagnosticCollectionXQuery.name;
    }

    set(uri: unknown, diagnostics?: unknown): void {
        channel.log("xqueryDiagnostics set: "+ uri);
        if (uri instanceof Array) {
            this.diagnosticCollectionXQuery.set(uri);
        } else {
            this.diagnosticCollectionXQuery.set(uri as vscode.Uri, diagnostics as vscode.Diagnostic[]);
        }
    }
    delete(uri: vscode.Uri): void {
        channel.log("xqueryDiagnostics delete: " +uri);
        this.diagnosticCollectionXQuery.delete(uri);
        this.xqlintCollectionXQuery.delete(uri);
    }

    clear(): void {
        channel.log("xqueryDiagnostics clear");
        this.diagnosticCollectionXQuery.clear();
        this.xqlintCollectionXQuery.clear();
    }

    forEach(callback: (uri: vscode.Uri, diagnostics: readonly vscode.Diagnostic[], collection: vscode.DiagnosticCollection) => any, thisArg?: any): void {
        this.diagnosticCollectionXQuery.forEach(callback);
    }
    get(uri: vscode.Uri): readonly vscode.Diagnostic[] {
        channel.log("xqueryDiagnostics get: " + uri);
        return this.diagnosticCollectionXQuery.get(uri);
    }
    has(uri: vscode.Uri): boolean {
        return this.diagnosticCollectionXQuery.has(uri);
    }
    dispose(): void {
        this.clear();
    }
    // really? https://blog.logrocket.com/understanding-typescript-generators/
    [Symbol.iterator](): Iterator<[uri: vscode.Uri, diagnostics: readonly vscode.Diagnostic[]], any, undefined> {
        const it: Iterator<[uri: vscode.Uri, diagnostics: readonly vscode.Diagnostic[]], any, undefined> = this.diagnosticCollectionXQuery[Symbol.iterator]();
        return it;
    }
}

/**
 * Analyzes the xquery document for problems. 
 * @param doc xquery document to analyze
 * @param xqueryDiagnostics diagnostic collection
 */
export function refreshDiagnostics(doc: vscode.TextDocument, xqueryDiagnostics: XQueryDiagnostics): void {
    const supportedSchemes = [constants.uriSchemes.file, constants.uriSchemes.untitled];

    if(doc.languageId !== constants.languageIds.xquery ||  supportedSchemes.indexOf(doc.uri.scheme) === -1){
        return;
    }
    channel.log("refreshDiagnostics" + doc.uri.toString());
    const diagnostics = new XQueryLinter().lint(doc)

    xqueryDiagnostics.set(doc.uri, diagnostics);
}


// forward doc changes
export function subscribeToDocumentChanges(context: vscode.ExtensionContext, xqueryDiagnostics: XQueryDiagnostics): void {
    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, xqueryDiagnostics);
    }
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor)  refreshDiagnostics(editor.document, xqueryDiagnostics);         
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, xqueryDiagnostics))
    );

    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(doc => xqueryDiagnostics.delete(doc.uri))
    );

}
