// execute XQuery via commandline
import { exec } from 'child_process';
import { OutputChannel, window } from "vscode";

export function spawn(cmd:string,outputChannel:OutputChannel){
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
};