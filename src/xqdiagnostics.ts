import * as vscode from 'vscode';
import * as constants from "./constants";
import { XQLint, Marker } from '@quodatum/xqlint';

import { channel, isNotXQDoc, unsupportedScheme, Configuration, importRange } from "./common";


// DiagnosticCollection for XQuery documents
export class XQueryDiagnostics {
    diagnosticCollectionXQuery: vscode.DiagnosticCollection;
    xqlintCollectionXQuery: Map<string, XQLint>;

    constructor() {
        this.diagnosticCollectionXQuery = vscode.languages.createDiagnosticCollection(constants.diagnosticCollections.xquery);
        this.xqlintCollectionXQuery = new Map();
        channel.log("xqueryDiagnostics new");
    }


    delete(uri: vscode.Uri): void {
        if (this.diagnosticCollectionXQuery.has(uri)) {
            channel.log("xqueryDiagnostics delete: " + uri);
            this.diagnosticCollectionXQuery.delete(uri);
            this.xqlintCollectionXQuery.delete(uri.toString());
        }
    }

    clear(): void {
        channel.log("xqueryDiagnostics clear");
        this.diagnosticCollectionXQuery.clear();
        this.xqlintCollectionXQuery.clear();
    }

    get(uri: vscode.Uri): readonly vscode.Diagnostic[] {
        channel.log("xqueryDiagnostics get: " + uri);
        return this.diagnosticCollectionXQuery.get(uri);
    }
    has(uri: vscode.Uri): boolean {
        return this.diagnosticCollectionXQuery.has(uri);
    }
    update(uri: vscode.Uri, document: string) {

        const processor = Configuration.xqueryProcessor;
        const opts = { "processor": processor, "fileName": uri.fsPath };
        const xqlint = new XQLint(document, opts);
        const diags = getDiagnostics(xqlint);
        this.xqlintCollectionXQuery.set(uri.toString(), xqlint);
        this.diagnosticCollectionXQuery.set(uri, diags)
    }
    xqlint(uri: vscode.Uri): XQLint {
        const k=uri.toString();
        const xq= this.xqlintCollectionXQuery.get(k);
        if(xq){
            return xq;
        } else{
           console.log("ERROR");
        }
    }

}

/**
 * Analyzes the xquery document for problems. 
 * @param doc xquery document to analyze
 * @param xqueryDiagnostics diagnostic collection
 */
export function refreshDiagnostics(doc: vscode.TextDocument,
    xqueryDiagnostics: XQueryDiagnostics,
    reason: string): void {
    if (isNotXQDoc(doc)) return;
    const isNew = !xqueryDiagnostics.has(doc.uri);
    const refresh = reason === "change";
    channel.log((isNew ? "🆕" : "") + (refresh ? "♻️" : "") + "refreshDiagnostics " + reason + " " + doc.uri.toString());
    if (isNew || refresh) {
        xqueryDiagnostics.update(doc.uri, doc.getText());
    }
}

// forward doc changes
export function subscribeToDocumentChanges(context: vscode.ExtensionContext, xqueryDiagnostics: XQueryDiagnostics): void {
    const ed = vscode.window.activeTextEditor;
    if (ed && !unsupportedScheme(ed.document.uri)) {
        refreshDiagnostics(ed.document, xqueryDiagnostics, "current");
    }

    const onDidClose = vscode.workspace.onDidCloseTextDocument(
        doc => xqueryDiagnostics.delete(doc.uri)
    );
    const onDidChange = vscode.workspace.onDidChangeTextDocument(
        e => refreshDiagnostics(e.document, xqueryDiagnostics, "change")
    );

    // https://stackoverflow.com/questions/68518501/vscode-workspace-ondidchangetextdocument-is-called-even-when-there-is-no-conte
    const onDidOpen = vscode.workspace.onDidOpenTextDocument(
        doc => refreshDiagnostics(doc, xqueryDiagnostics, "open")
    );

    const onDidActive = vscode.window.onDidChangeActiveTextEditor(
        editor => {
            if (editor) refreshDiagnostics(editor.document, xqueryDiagnostics, "active");
        }
    );
    context.subscriptions.push(onDidOpen, onDidChange, onDidClose, onDidActive);
}

function getDiagnostics(linter: XQLint): vscode.Diagnostic[] {
    const diagnostics = new Array<vscode.Diagnostic>();

    linter.getErrors().forEach((error: Marker) => {
        diagnostics.push(new vscode.Diagnostic(
            importRange(error.pos),
            error.message,
            isSuppressed(error.message) ? vscode.DiagnosticSeverity.Information : vscode.DiagnosticSeverity.Error
        ));
    });

    linter.getWarnings().forEach((warning: Marker) => {
        diagnostics.push(new vscode.Diagnostic(
            importRange(warning.pos),
            warning.message,
            vscode.DiagnosticSeverity.Warning
        ));
    });
    return diagnostics;
}
// [XQST0059] module "http://config" not found
// [XPST0008] "list-details#0": undeclared function
function isSuppressed(msg: string): boolean {
    const errs = Configuration.xquerySuppressErrors;
    return errs.some((x) => msg.includes(x));
}
