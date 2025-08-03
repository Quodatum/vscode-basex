//execute xquery using fontoxpath
import { evaluateXPathToString, evaluateXPath } from 'fontoxpath';
import { OutputChannel, window } from "vscode";

export function execute(cmd: string, outputChannel: OutputChannel) {
    try {
        const res = evaluateXPathToString(
            cmd,
            null,
            null,
            null,
            { language: evaluateXPath.XQUERY_3_1_LANGUAGE }
        );
        outputChannel.appendLine(res);
    } catch (error) {
        outputChannel.appendLine(`Error executing batch file: ${error.message}`);
        window.showErrorMessage(`XQuery execution error:  ${error.message}`);
    }

};