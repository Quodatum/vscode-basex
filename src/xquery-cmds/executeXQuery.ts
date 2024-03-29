import { OutputChannel, window } from "vscode";
import { TextEditor, TextEditorEdit } from "vscode";

import * as constants from "../constants";
import { channel, logdate } from "../common/channel-basex";
import { ChildProcess } from "../common/child-process";
import { Configuration, NativeCommands } from "../common";

let outputChannel: OutputChannel;

export async function executeXQuery(editor: TextEditor, edit: TextEditorEdit): Promise<void> {

      const canEval = [constants.languageIds.xquery,
    constants.languageIds.bxsCmd,
    constants.languageIds.bxsXml];
    if (!canEval.includes(editor.document.languageId)) {
        window.showErrorMessage("XQuery execute not supported for filetype.");
        return;
    }
    if (!outputChannel) outputChannel = window.createOutputChannel("XQuery execution");

    const src: string = editor.document.uri.toString();
    channel.log("executeXQuery:" + src);
    const executable = Configuration.xqueryExecutionEngine;
    const args: string[] = [src];
    if (!executable || executable === "") {
        const action = await window.showWarningMessage("An XQuery execution engine has not been defined.", "Define Now");
        if (action === "Define Now") {
            NativeCommands.openGlobalSettings();
        }
        return;
    }
    const disposable = window.setStatusBarMessage("XQuery start execution...");

    //outputChannel.clear();

    outputChannel.appendLine(`${logdate()} XQuery: ${src}`);
    outputChannel.append("\n");
    try {
        const bl = await ChildProcess.spawn('basex', args);
        outputChannel.appendLine(bl.toString());

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        outputChannel.appendLine(e.toString());
        outputChannel.appendLine(e.stdout.toString());
        outputChannel.appendLine(e.stderr.toString());
        window.showErrorMessage("Xquery error - see channel");
    }
    disposable.dispose();
    outputChannel.show(false);
}

