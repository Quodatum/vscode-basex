import { TextDocument, TextEditor, Range, window } from 'vscode';

/* Total range for document */
export function fullRange(document: TextDocument): Range {
    const lastLine = document.lineAt(document.lineCount - 1);
    return new Range(document.positionAt(0), lastLine.range.end);
}
/* true if empty */
export function isEmpty(document: TextDocument): boolean {
    return (document.lineCount === 1) && document.lineAt(document.lineCount - 1).isEmptyOrWhitespace
}

/* 1st editor for document */
export function findEditor(doc: TextDocument): TextEditor | undefined {
    return window.visibleTextEditors.find(editor => editor.document === doc)
}