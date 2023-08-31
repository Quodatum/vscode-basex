// todo 
// see https://github.com/microsoft/vscode-extension-samples/tree/main/contentprovider-sample
import *  as vscode from "vscode";
import { languageIds,commands } from "../constants";
import { channel, dump } from "../common/channel-basex";
import { XQLintFactory } from "../common/xqlint";


export function activateVirtualDocs({ subscriptions }: vscode.ExtensionContext) {

    // register a content provider for the parse-scheme
    const parseScheme =commands.xqParse;

    const parseProvider = new class implements vscode.TextDocumentContentProvider {

        // emitter and its event
        onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
        onDidChange = this.onDidChangeEmitter.event;

        provideTextDocumentContent(uri: vscode.Uri): string {
            // simply invoke cowsay, use uri-path as text
            const document = xqueryDoc();
            if (!document) return;
            const linter = XQLintFactory.XQLint2(document.uri,document.getText())
            return linter.printAST();
        }
    };
    subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(parseScheme, parseProvider));

    // register a command that opens a xqparse-document
    subscriptions.push(vscode.commands.registerTextEditorCommand(commands.xqParse, async editor => {
        const uri = vscode.Uri.parse(`${parseScheme}:${editor.document.uri}.xml`);
        const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
        vscode.languages.setTextDocumentLanguage(doc, "xml");
        await vscode.window.showTextDocument(doc, editor.viewColumn! + 1);

    }));

    const xqdocScheme = commands.xqDoc;
    const xqdocProvider = new class implements vscode.TextDocumentContentProvider {

        // emitter and its event
        onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
        onDidChange = this.onDidChangeEmitter.event;

        provideTextDocumentContent(uri: vscode.Uri): string {
            const document = xqueryDoc();
            if (!document) return;
            const linter = XQLintFactory.XQLint2(document.uri,document.getText());
            const xqdoc= linter.getXQDoc();
            return JSON.stringify(xqdoc,undefined," ") ;
        }
    };
    subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(xqdocScheme, xqdocProvider));

    subscriptions.push(vscode.commands.registerTextEditorCommand(commands.xqDoc, async editor => {
        const uri = vscode.Uri.parse(`${xqdocScheme}:${editor.document.uri}.json`);
        const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
        vscode.languages.setTextDocumentLanguage(doc, "json");
        await vscode.window.showTextDocument(doc, editor.viewColumn! + 1);
    }));
}


// dump node to console
export function xqLintReport(textEditor: vscode.TextEditor): void {
    const linter = XQLintFactory.XQLint(textEditor.document);


    textEditor.edit(textEdit => {
        const selections = textEditor.selections;
        selections.forEach(selection => {
            const pos = selection.start.translate(1, 1); //@TODO
            const node = linter.getAST(pos);
            const sctx = linter.getCompletions(pos);
            const dx = dump(node);
            channel.appendLine(dx);
        });
    });
}

// the active xquery doc or null
function xqueryDoc(): vscode.TextDocument {
    if (!vscode.window.activeTextEditor) {
        return null; // no editor
    }
    const { document } = vscode.window.activeTextEditor;
    return (document.languageId === languageIds.xquery) ? document : null;
}