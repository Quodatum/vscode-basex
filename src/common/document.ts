import {  TextDocument,Range} from 'vscode';

export function fullRange(document:TextDocument) {
    const lastLine = document.lineAt(document.lineCount - 1);
    return new Range(document.positionAt(0), lastLine.range.end);
}
export function isEmpty(document:TextDocument) :boolean{
    return (document.lineCount ===1) && document.lineAt(document.lineCount - 1).isEmptyOrWhitespace
}
