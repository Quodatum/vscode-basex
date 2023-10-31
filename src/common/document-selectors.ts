import { DocumentFilter, Uri, TextDocument ,TextEditor} from "vscode";

import * as constants from "../constants";

export function createDocumentSelector(language: string): DocumentFilter[] {
    return [
        { language: language, scheme: constants.uriSchemes.file },
        { language: language, scheme: constants.uriSchemes.untitled },
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
    const supportedSchemes = [constants.uriSchemes.file, constants.uriSchemes.untitled];
    return supportedSchemes.indexOf(uri.scheme) === -1;
}

