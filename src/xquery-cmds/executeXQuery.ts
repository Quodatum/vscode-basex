import {
    commands, OutputChannel, window,
    TextEditor, TextEditorEdit, QuickPickItem
} from "vscode";

import * as constants from "../constants";
import { logdate } from "../common/channel-basex";
import { Configuration, executionCommand, ExtensionTopLevelSection } from "../common";
import { exec } from 'child_process';
class PickItem implements QuickPickItem {
    label: string;
    detail = '';
    id: string;

    constructor(item: executionCommand) {
        this.label = item.name;
        this.detail = item.cmd;
        this.id = item.name
    }
}
const canEval = [constants.languageIds.xquery,
constants.languageIds.bxsCmd,
constants.languageIds.bxsXml
];

let outputChannel: OutputChannel;

export async function executeXQuery(editor: TextEditor, _edit: TextEditorEdit): Promise<void> {
    if (!canEval.includes(editor.document.languageId)) {
        window.showErrorMessage(`XQuery execute not supported for filetype: ${editor.document.languageId}`);
        return;
    }
    const src: string = editor.document.uri.fsPath;

    const active = Configuration.xqueryExecutionDefault;
    const execCmds = Configuration.xqueryExecutionCommands;

    const items = execCmds.map(item => new PickItem(item));
    const index=items.findIndex(item=>item.id==active);
    const quickPick = window.createQuickPick();
    quickPick.items = items;
    quickPick.title = 'select XQuery execution command ' + index;
    //quickPick.selectedItems = items.filter(item => item.id == active);
    // Show and handle selection
    quickPick.show();
    const result = await new Promise<QuickPickItem | undefined>(resolve => {
        quickPick.onDidAccept(() => {
            resolve(quickPick.selectedItems[0]);
            quickPick.hide();
        });
        quickPick.onDidHide(() => resolve(undefined));
    });
    quickPick.dispose();
    if (!result) return;
    Configuration.xqueryExecutionDefault = result.label;
    const cmd = expandCommand(result.detail, { "file": src });

    if (!cmd || cmd === "") {
        const action = await window.showWarningMessage("No XQuery execution engine has not been defined.", "Define Now");
        if (action === "Define Now") {
            commands.executeCommand("workbench.action.openGlobalSettings",
                ExtensionTopLevelSection + "xquery.executionDefault");
        }
        return;
    }
    if (!outputChannel) outputChannel = window.createOutputChannel("XQuery execution");
    const disposable = window.setStatusBarMessage("XQuery start execution...");

    outputChannel.appendLine(`${logdate()} XQuery: ${cmd}`);
    outputChannel.append("\n");

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            outputChannel.appendLine(`Error executing batch file: ${error.message}`);
            window.showErrorMessage(`XQuery execution error:  ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Batch file stderr: ${stderr}`);
            return;
        }

        outputChannel.appendLine(`${stdout}`);
    });
    disposable.dispose();
    outputChannel.show(true);
}

// expand variables in execution command
function expandCommand(cmd: string, sysvars: { [index: string]: string }, options?: { throwOnMissing?: boolean }): string {
    const throwOnMissing = options?.throwOnMissing ?? false;

    return cmd.replace(/\{([^}]+)\}/g, (match, envVarName: string) => {
        const firstChar = String.fromCodePoint(envVarName.codePointAt(0));
        const name = envVarName.startsWith(firstChar) ? envVarName.slice(firstChar.length) : envVarName;
        let envVarValue;
        switch (firstChar) {
            case "📁": // app value typically file
                envVarValue = sysvars[name];
                break;
            case "🌐": //environment value
                envVarValue = process.env[name];
                break;
            case "🔒": //read from secrets
                envVarValue="admin";
                //@TODO
                break;
            default:
            //keep
        }


        if (envVarValue === undefined) {
            if (throwOnMissing) {
                throw new Error(`Environment variable '${envVarName}' not found`);
            }
            // Return original match if not found and not throwing
            return match;
        }

        return envVarValue;

    })
};

function _arraymove(arr:[], fromIndex:number, toIndex:number) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}
