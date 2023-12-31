import { DocumentFilter, Uri, TextDocument ,TextEditor} from "vscode";

import * as constants from "../constants";
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace uriSchemes {
    export const file = "file";
    export const untitled = "untitled";
}

export function createDocumentSelector(language: string): DocumentFilter[] {
    return [
        { language: language, scheme: uriSchemes.file },
        { language: language, scheme: uriSchemes.untitled },
    ];
}

export function isXqEditor(editor: TextEditor):boolean{
 return editor && !isNotXQDoc(editor.document);
}
// must be an xq doc in supported scheme
export function isNotXQDoc(doc: TextDocument): boolean {
    if (!doc || doc.languageId !== constants.languageIds.xquery) return true;
    return unsupportedScheme(doc.uri)
}
// only supported schemes
export function unsupportedScheme(uri: Uri): boolean {
    const supportedSchemes = [uriSchemes.file, uriSchemes.untitled];
    return supportedSchemes.indexOf(uri.scheme) === -1;
}

