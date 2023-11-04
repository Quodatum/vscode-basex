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


// DiagnosticCollection for XQuery documents
export class XQLinter {
    diagnosticCollectionXQuery: vscode.DiagnosticCollection;
    xqlintCollectionXQuery: Map<string, XQLint>;

    private diagEmitter = new vscode.EventEmitter<IXQParsedEvent>();
    onXQParsed: vscode.Event<IXQParsedEvent> = this.diagEmitter.event;

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
            this.diagEmitter.fire(new ParsedEvent(uri));
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
    set(uri: vscode.Uri, diagnostics: vscode.Diagnostic[]) {
        this.diagnosticCollectionXQuery.set(uri, diagnostics);
    }
    has(uri: vscode.Uri): boolean {
        return this.diagnosticCollectionXQuery.has(uri);
    }

    update(uri: vscode.Uri, document: string) {
        const xqlint = linter(uri, document);
        this.xqlintCollectionXQuery.set(uri.toString(), xqlint);
        this.diagEmitter.fire(new ParsedEvent(uri, xqlint))
    }

    xqlint(uri: vscode.Uri): XQLint {
        const xq = this.xqlintCollectionXQuery.get(uri.toString());
        if (xq) {
            return xq;
        } else {
            throw { name: "NOXQLINT", message: "should not happen" };
        }
    }

}
function linter(uri: vscode.Uri, document: string) {
    const processor = Configuration.xqueryProcessor;
    const opts = { "processor": processor, "fileName": uri.fsPath };
    return new XQLint(document, opts);
}

/**
 * Analyzes the xquery document for problems. 
 * @param doc xquery document to analyze
 * @param xqueryDiagnostics diagnostic collection
 */
export function refreshDiagnostics(doc: vscode.TextDocument,
    xqueryDiagnostics: XQLinter,
    reason: string): void {
    if (isNotXQDoc(doc)) return;
    const editor = findEditor(doc);

    const isNew = !xqueryDiagnostics.has(doc.uri);
    const refresh = reason === "change";
    channel.log((isNew ? "🆕" : "") + (refresh ? "♻️" : "") + "refreshDiagnostics " + reason + " " + doc.uri.toString());
    if (isNew || refresh) {
        const text = doc.getText();
        xqueryDiagnostics.update(doc.uri, text);
        const xqlint = xqueryDiagnostics.xqlint(doc.uri);
        const diagnostics = new Array<vscode.Diagnostic>();
       
        pushXQLintDiagnostics(diagnostics, xqlint);

        xqueryDiagnostics.set(doc.uri, diagnostics);
        channel.log("diagnostics.length: " + diagnostics.length);
    }
    if (editor) {
        const xqlint = xqueryDiagnostics.xqlint(doc.uri);
        decorate(editor, xqlint);
    }
}
// forward doc changes
export function subscribeToDocumentChanges(context: vscode.ExtensionContext, xqueryDiagnostics: XQLinter): void {
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
    linter: XQLint): vscode.Diagnostic[] {

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
const parseFailedDecorationType = vscode.window.createTextEditorDecorationType({
    borderWidth: '1px',
    borderStyle: 'solid',

    overviewRulerColor: 'red',
    overviewRulerLane: vscode.OverviewRulerLane.Right,

    light: {
        // this color will be used in light color themes
        borderColor: 'darkred',
        backgroundColor: 'lightpink',
    },
    dark: {
        // this color will be used in dark color themes
        borderColor: 'lightred',
        backgroundColor: 'deeppink',
    }
});


function decorate(editor: vscode.TextEditor, xqlint: XQLint) {
    const theDecorations: vscode.DecorationOptions[] = [];
    if (xqlint.hasSyntaxError()) {
        const r = xqlint.getErrors();
        const range1 = importRange(r[0].pos);
        const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
        const range = range1.with(range1.end, lastLine.range.end)
        const decoration = { range: range, hoverMessage: 'Parse failed at line:' + range1.end.line };
        theDecorations.push(decoration);
    }
    editor.setDecorations(parseFailedDecorationType, theDecorations);
}
