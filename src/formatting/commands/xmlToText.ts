
import {  Range,  TextEditor, Selection } from "vscode";



export function xmlToText(textEditor: TextEditor): void {
    textEditor.edit(textEdit => {
        const selections = textEditor.selections;
        selections.forEach(selection => {
            if (selection.isEmpty) {
                selection = new Selection(
                    textEditor.document.positionAt(0),
                    textEditor.document.positionAt(textEditor.document.getText().length)
                );
            }
            const txt = textEditor.document.getText(new Range(selection.start, selection.end));
            const transformed = txt
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&apos;");

            textEdit.replace(selection, transformed);
        });
    });
}
export function textToXml(textEditor: TextEditor): void {
    textEditor.edit(textEdit => {
        const selections = textEditor.selections;
        selections.forEach(selection => {
            if (selection.isEmpty) {
                selection = new Selection(
                    textEditor.document.positionAt(0),
                    textEditor.document.positionAt(textEditor.document.getText().length)
                );
            }
            const txt = textEditor.document.getText(new Range(selection.start, selection.end));
            const transformed = txt
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                // tslint:disable-next-line
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'")
                .replace(/&amp;/g, "&");
            textEdit.replace(selection, transformed);
        });
    });
}

