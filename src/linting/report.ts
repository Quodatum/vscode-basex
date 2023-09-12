// todo 
// see https://github.com/microsoft/vscode-extension-samples/tree/main/contentprovider-sample
import  * as vscode from "vscode";
import { commands } from "../constants";
import { channel, dump,closeFileIfOpen, unsupportedScheme } from "../common";
import { diagnosticCollectionXQuery } from "../extension";

export function activateVirtualDocs({ subscriptions }: vscode.ExtensionContext) {

    // register a content provider for the parse-scheme
    const parseScheme =commands.xqParse;

    const parseProvider = new class implements vscode.TextDocumentContentProvider {
        provideTextDocumentContent(uri: vscode.Uri): string {
            const orig=sourceUri(uri);
            if(unsupportedScheme(orig)) return;
            return diagnosticCollectionXQuery.xqlint(orig).printAST(); 
        }
    };
    subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(parseScheme, parseProvider));

    // register a command that opens a xqparse-document
    subscriptions.push(vscode.commands.registerTextEditorCommand(commands.xqParse, async editor => {
        const uri = vscode.Uri.parse(`${parseScheme}:${editor.document.uri}.xml`);
        const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
        vscode.languages.setTextDocumentLanguage(doc, "xml");
       /*  const onDidChangeDisposable = vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent)=>{
            if (event.document === editor.document){
                console.log('Watched doc changed: '+ editor.document.uri);
            }  
        });
        const onDidCloseDisposable = vscode.workspace.onDidCloseTextDocument((closedDoc: vscode.TextDocument)=>{
            if (closedDoc  === editor.document){
                console.log('Watched doc was closed: '+onDidCloseDisposable);
                closeFileIfOpen(closedDoc.uri);
            }    
        });
        subscriptions.push(onDidChangeDisposable,onDidCloseDisposable); */
        await vscode.window.showTextDocument(doc, editor.viewColumn! + 1);

    }));

    const xqdocScheme = commands.xqDoc;
    const xqdocProvider = new class implements vscode.TextDocumentContentProvider {
        provideTextDocumentContent(uri: vscode.Uri): string {
            const orig=sourceUri(uri);
            if(unsupportedScheme(orig)) return;
            const xqdoc=diagnosticCollectionXQuery.xqlint(orig).getXQDoc(); 
            return JSON.stringify(xqdoc,undefined," ") ;
        }
    };
    subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(xqdocScheme, xqdocProvider));

    subscriptions.push(vscode.commands.registerTextEditorCommand(commands.xqDoc, async editor => {
        const uri = vscode.Uri.parse(`${xqdocScheme}:${editor.document.uri}.json`);
        const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
        vscode.languages.setTextDocumentLanguage(doc, "json");

        const onDidChangeDisposable = vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent)=>{
            if (event.document === editor.document){
                console.log('Watched doc changed: '+ editor.document.uri);
            }  
        });
        const onDidCloseDisposable = vscode.workspace.onDidCloseTextDocument((closedDoc: vscode.TextDocument)=>{
            if (closedDoc  === editor.document){
                console.log('Watched doc was closed: '+onDidCloseDisposable);
                closeFileIfOpen(closedDoc.uri);
            }    
        });
        subscriptions.push(onDidChangeDisposable,onDidCloseDisposable);

        await vscode.window.showTextDocument(doc, editor.viewColumn! + 1);
    }));

}
// convert custom scheme back to source uri
 function sourceUri(uri: vscode.Uri): vscode.Uri {
    const p=uri.path;
    return  vscode.Uri.parse(p.substring(0, p.lastIndexOf('.')));

}


// dump node to console
export function xqLintReport(textEditor: vscode.TextEditor): void {
    const linter = diagnosticCollectionXQuery.xqlint(textEditor.document.uri);
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

