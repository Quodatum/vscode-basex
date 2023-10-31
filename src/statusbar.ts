//  statusbar: show profile when xq active
import * as vscode from 'vscode';
import { commands } from "./constants";
import { isXqEditor,Configuration } from "./common";
import { XQLinter } from './xqlints';

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    diagnostics: XQLinter) {
    // create a new status bar item that we can now manage
    myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    myStatusBarItem.command = commands.xqProcessor;

    subscriptions.push(myStatusBarItem);
    const onDidActive = vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem);
    updateStatusBarItem(vscode.window.activeTextEditor);
    // register some listener that make sure the status bar always up-to-date
    subscriptions.push(onDidActive);

    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration(commands.xqProcessor)) {
            updateStatusBarItem(vscode.window.activeTextEditor);
         }
    })
}

function updateStatusBarItem(active: vscode.TextEditor): void {
    if (isXqEditor(active)) {
        const profile = Configuration.xqueryProcessor;
        myStatusBarItem.text = `$(package) ${profile}`;
        myStatusBarItem.tooltip = "select active XQuery profile"
        myStatusBarItem.show();
    } else {
        myStatusBarItem.hide();
    }
}
