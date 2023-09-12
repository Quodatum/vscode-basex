// XQuery Document link provider

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Quodatum. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import {  DocLink } from '@quodatum/xqlint';
import {
    ExtensionContext, languages, TextDocument, CancellationToken,
    DocumentLink, DocumentLinkProvider,Uri
} from 'vscode';
import { channel,importRange } from "../common";
import { diagnosticCollectionXQuery } from "../extension";
import { languageIds } from "../constants";


export function activate(context: ExtensionContext) {
    context.subscriptions.push(languages.registerDocumentLinkProvider(
        { language: languageIds.xquery }, new XQueryDocumentLinks())
    );
}
class XQueryDocumentLinks implements DocumentLinkProvider {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provideDocumentLinks = async (doc: TextDocument, _token: CancellationToken): Promise<DocumentLink[]> => {
        channel.start("Doclinks" , doc.uri);
        const linter =   diagnosticCollectionXQuery.xqlint(doc.uri); 
        const dlinks = linter.getDocLinks();

        const links: DocumentLink[] = [];
        dlinks.forEach((d2:[DocLink])=>{
            const link:DocLink=d2[0]
            const range=importRange(link.range );
              
            const uri=Uri.joinPath(doc.uri,"../"+ link.uri);
            links.push(new DocumentLink(range, uri));
        });
        return links;
    };

}
