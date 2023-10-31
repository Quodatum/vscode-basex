/*---------------------------------------------------------
 * Copyright (C) Quodatum Ltd
 *--------------------------------------------------------*/

import * as vscode from 'vscode';
import { XQ_ACTION } from './codeactions-diagnostics';
import { languageIds } from "../constants";
import { XQLinter } from "../xqlints";
import { isEmpty } from '../common'
import { IXQParsedEvent } from '../xqdiagEvents';
const COMMAND = 'code-actions-basex.command';

export function activate(context: vscode.ExtensionContext, diagnosticCollectionXQuery: XQLinter) {
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(languageIds.xquery, new XQActionProvider(), {
            providedCodeActionKinds: XQActionProvider.providedCodeActionKinds
        }));

    const xqActionsDiagnostics = vscode.languages.createDiagnosticCollection("xq-actions");
    
    context.subscriptions.push(xqActionsDiagnostics);
    const update=function(event: IXQParsedEvent) {
        if (event.xqlint) {
            console.log("Parsed: " + event.uri.toString());
            xqActionsDiagnostics
        } else {
            console.log("Dropped: " + event.uri.toString());
        }

    };
    diagnosticCollectionXQuery.onXQParsed(update);
    //subscribeToDocumentChanges(context, xqActionsDiagnostics);

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(languageIds.xquery, new Emojinfo(), {
            providedCodeActionKinds: Emojinfo.providedCodeActionKinds
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(COMMAND, () => vscode.env.openExternal(vscode.Uri.parse('https://unicode.org/emoji/charts-12.0/full-emoji-list.html')))
    );
}

/**
 * Provides code actions for converting :) to a smiley emoji.
 */
export class XQActionProvider implements vscode.CodeActionProvider {

    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public provideCodeActions(document: vscode.TextDocument, _range: vscode.Range): vscode.CodeAction[] | undefined {
        const actions = [];
        if (isEmpty(document)) {
            const emptyFix = this.insertSnippet(document);
            actions.push(emptyFix);
        }
        return actions;
    }



    private insertSnippet(document: vscode.TextDocument): vscode.CodeAction {
        const fix = new vscode.CodeAction(`insert template`, vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        const startPos = document.positionAt(0);
        const snippet = new vscode.SnippetString("module namespace ${1:ns} = '${2:http://www.example.com/}';");
        fix.edit.set(document.uri, [vscode.SnippetTextEdit.insert(startPos, snippet)])
        return fix;
    }

    private createCommand(): vscode.CodeAction {
        const action = new vscode.CodeAction('Learn more...', vscode.CodeActionKind.Empty);
        action.command = { command: COMMAND, title: 'Learn more about emojis', tooltip: 'This will open the unicode emoji page.' };
        return action;
    }
}

/**
 * Provides code actions corresponding to diagnostic problems.
 */
export class Emojinfo implements vscode.CodeActionProvider {

    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
        // for each diagnostic entry that has the matching `code`, create a code action command
        return context.diagnostics
            .filter(diagnostic => diagnostic.code === XQ_ACTION)
            .map(diagnostic => this.createCommandCodeAction(diagnostic));
    }

    private createCommandCodeAction(diagnostic: vscode.Diagnostic): vscode.CodeAction {
        const action = new vscode.CodeAction('Learn more...', vscode.CodeActionKind.QuickFix);
        action.command = { command: COMMAND, title: 'Learn more about emojis', tooltip: 'This will open the unicode emoji page.' };
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        return action;
    }
}
async function insertSnippet(name: string) {
    // the below uses a pre-existing snippet with a name 'Custom Header'
    await vscode.commands.executeCommand("editor.action.insertSnippet", { "name": name });
}
