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
import { channel } from "../common/channel-basex";
import { XQLintFactory, importRange } from "../common/xqlint";
import { languageIds } from "../constants";


export function activate(context: ExtensionContext) {
    context.subscriptions.push(languages.registerDocumentLinkProvider(
        { language: languageIds.xquery }, new XQueryDocumentLinks())
    );
}
class XQueryDocumentLinks implements DocumentLinkProvider {
    provideDocumentLinks = async (doc: TextDocument, token: CancellationToken): Promise<DocumentLink[]> => {
        channel.log("Doclinks: " + doc.uri);
        const linter = XQLintFactory.XQLint(doc);
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
