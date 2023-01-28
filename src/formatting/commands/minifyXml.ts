import { Range, TextEditor, TextEditorEdit } from "vscode";


import { XmlFormatterFactory } from "../xml-formatter";
import { XmlFormattingOptionsFactory } from "../xml-formatting-options";

export function minifyXml(editor: TextEditor, edit: TextEditorEdit): void {
    const xmlFormatter = XmlFormatterFactory.getXmlFormatter();
    const xmlFormattingOptions = XmlFormattingOptionsFactory.getXmlFormattingOptions({
        insertSpaces: <boolean>editor.options.insertSpaces,
        tabSize: <number>editor.options.tabSize
    }, editor.document);

    const endPosition = editor.document.lineAt(editor.document.lineCount - 1).rangeIncludingLineBreak.end;
    const range = new Range(editor.document.positionAt(0), endPosition);

    edit.replace(range, xmlFormatter.minifyXml(editor.document.getText(), xmlFormattingOptions));
}
