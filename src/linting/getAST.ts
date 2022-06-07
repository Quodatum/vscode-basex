
import {  Range,  TextEditor, Selection } from "vscode";
import { channel } from "../common/logger";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XQLint = require("@quodatum/xqlint").XQLint;

export function getAst(textEditor: TextEditor): void {
    textEditor.edit(textEdit => {
        const selections = textEditor.selections;
        selections.forEach(selection => {
            if (selection.isEmpty) {
                selection = new Selection(
                    textEditor.document.positionAt(0),
                    textEditor.document.positionAt(textEditor.document.getText().length)
                );
            }
            const text = textEditor.document.getText(new Range(selection.start, selection.end));
            const linter = new XQLint(text);
            const ast=linter.getAST();
           channel.appendLine(ast);
        });
    });
}