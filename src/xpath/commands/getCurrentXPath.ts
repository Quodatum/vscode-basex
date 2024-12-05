import { window } from "vscode";
import { TextEditor, TextEditorEdit } from "vscode";
import { sync } from 'slimdom-sax-parser';
import * as slimdom from "slimdom";
import { XPathBuilder } from "../xpath-builder";

export function getCurrentXPath(editor: TextEditor, _edit: TextEditorEdit): void {
    if (!editor.selection) {
        window.showInformationMessage("Please put your cursor in an element or attribute name.");
        return;
    }

    const document = sync(editor.document.getText()) as unknown as slimdom.Document;
    const xpath = new XPathBuilder(document).build(editor.selection.start);

    window.showInputBox({
        value: xpath,
        valueSelection: undefined
    });
}
