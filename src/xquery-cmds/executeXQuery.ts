import {
    commands, OutputChannel, window,
    TextEditor, TextEditorEdit, QuickPickItem
} from "vscode";
import {getPassword} from "../common"
import {languageIds} from "../constants";
import { logdate, pickOne } from "../common";
import { Configuration, ExtensionTopLevelSection } from "../common";
import {spawn} from "./execSpawn";


// a named commandline
export type executionCommand = {
    name: string;
    cmd: string;
};
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
const canEval = [languageIds.xquery, languageIds.bxsCmd, languageIds.bxsXml];

let outputChannel: OutputChannel;

export async function executeXQuery(editor: TextEditor, _edit: TextEditorEdit): Promise<void> {
    if (!canEval.includes(editor.document.languageId)) {
        window.showErrorMessage(`XQuery execute not supported for language: ${editor.document.languageId}`);
        return;
    }
    const src: string = editor.document.uri.fsPath;

    const active = Configuration.xqueryExecutionDefault;
    const execCmds = Configuration.xqueryObject<executionCommand>("xquery.executionCommands");

    const items = execCmds.map(item => new PickItem(item));
    const index = items.findIndex(item => item.label == active);
    const result = await pickOne(items, index);

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
    spawn(cmd,outputChannel)
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
                { const _a=getPassword(name);
                window.showErrorMessage(`XQuery execution error ${_a}`);
                envVarValue = "admin";
                //@TODO
                break; }
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

// report undefined variables in execution command
function checkCommand(cmd: string, sysvars: { [index: string]: string }) {
    const m = [];
    cmd.replace(/\{([^}]+)\}/g, (match, envVarName: string) => {
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
                envVarValue = "admin";
                //@TODO
                break;
            default:
            //keep
        };
        if (envVarValue === undefined) {
             
                throw new Error(`Environment variable '${envVarName}' not found`);
         
            // Return original match if not found and not throwing
            return match;
        }
        return envVarValue;
    });
    
};
