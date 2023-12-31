/*

*/
import * as vscode from 'vscode';
import * as constants from "./constants";
import { IXQParsedEvent, XQParsedEvent as ParsedEvent } from "./xqdiagEvents";

import { XQLint, Marker } from '@quodatum/xqlint';

import {
    channel, isNotXQDoc, unsupportedScheme,
    Configuration, importRange, findEditor
} from "./common";
import { TextDocument } from 'vscode';


// DiagnosticCollection for XQuery documents
export class XQLinters {
    diagnosticCollectionXQuery: vscode.DiagnosticCollection;
    xqlintCollection: Map<string, XQLint>;

    private diagEmitter = new vscode.EventEmitter<IXQParsedEvent>();
    onXQParsed: vscode.Event<IXQParsedEvent> = this.diagEmitter.event;

    constructor() {
        this.diagnosticCollectionXQuery = vscode.languages.createDiagnosticCollection(constants.diagnosticCollections.xquery);
        this.xqlintCollection = new Map();
        channel.log("xqueryDiagnostics new");
    }


    delete(uri: vscode.Uri): void {
        if (this.diagnosticCollectionXQuery.has(uri)) {
            channel.log("xqueryDiagnostics delete: " + uri);
            this.diagnosticCollectionXQuery.delete(uri);
            this.xqlintCollection.delete(uri.toString());
            this.diagEmitter.fire(new ParsedEvent(uri));
        }
    }

    clear(): void {
        if (this) {
            channel.log("xqueryDiagnostics clear");
            this.xqlintCollection.clear();
            this.diagnosticCollectionXQuery.clear();
        } else {
            channel.log("xqueryDiagnostics unset!");
        }
    }

    get(uri: vscode.Uri): readonly vscode.Diagnostic[] {
        channel.log("xqueryDiagnostics get: " + uri);
        return this.diagnosticCollectionXQuery.get(uri);
    }
    set(uri: vscode.Uri, diagnostics: vscode.Diagnostic[]) {
        this.diagnosticCollectionXQuery.set(uri, diagnostics);
    }
    has(uri: vscode.Uri): boolean {
        return this.xqlintCollection.has(uri.toString());
    }

    update(doc: TextDocument) {
        const xqlint = linter(doc.uri, doc.getText());
        this.xqlintCollection.set(doc.uri.toString(), xqlint);
        this.diagEmitter.fire(new ParsedEvent(doc.uri, xqlint))
    }

    xqlint(uri: vscode.Uri): XQLint {
        const xq = this.xqlintCollection.get(uri.toString());
        if (xq) {
            return xq;
        } else {
            throw { name: "NOXQLINT", message: uri.fsPath };
        }
    }
    xqlint2(doc: TextDocument): XQLint {
        if (!this.has(doc.uri)) {
            this.update(doc);
        }
        return this.xqlintCollection.get(doc.uri.toString());
    }
}

// do the parse
function linter(uri: vscode.Uri, document: string) {
    const processor = Configuration.xqueryProfile;
    const opts = { "processor": processor, "fileName": uri.fsPath };
    return new XQLint(document, opts);

}

/**
 * Analyzes the xquery document for problems. 
 * @param doc xquery document to analyze
 * @param xqLinters diagnostic collection
 */
export function refreshDiagnostics(doc: vscode.TextDocument,
    xqLinters: XQLinters,
    reason: string): void {
    if (isNotXQDoc(doc)) return;
    const editor = findEditor(doc);

    const isNew = !xqLinters.has(doc.uri);
    const refresh = reason === "change";
    channel.log((isNew ? "🆕" : "") + (refresh ? "♻️" : "") + "refreshDiagnostics " + reason + " " + doc.uri.toString());
    if (isNew || refresh) {
       
        xqLinters.update(doc);
        const xqlint = xqLinters.xqlint(doc.uri);
        const diagnostics = new Array<vscode.Diagnostic>();

        pushXQLintDiagnostics(diagnostics, xqlint);

        xqLinters.set(doc.uri, diagnostics);
        channel.log("diagnostics.length: " + diagnostics.length);
    }
    
}
// forward doc changes
export function subscribeToDocumentChanges(context: vscode.ExtensionContext, xqueryDiagnostics: XQLinters): void {
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

function pushXQLintDiagnostics(
    diagnostics: vscode.Diagnostic[],
    linter: XQLint) {
    linter.getMarkers().forEach(
        (mark: Marker) => {
            const type = mark.level === "error" ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;
            const diag=new vscode.Diagnostic(
                importRange(mark.pos),
                mark.message,
                isSuppressed(mark.message) ? vscode.DiagnosticSeverity.Information : type
            );
            diag.code=mark.code;
            diag.source="xqlint";
            diagnostics.push(diag);
        }
    );
   

}

// [XQST0059] module "http://config" not found
// [XPST0008] "list-details#0": undeclared function
function isSuppressed(msg: string): boolean {
    const errs = Configuration.xquerySuppressErrors;
    return errs.some((x) => msg.includes(x));
}

