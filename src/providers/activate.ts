import { ExtensionContext} from "vscode";
import {XQLinter} from "../xqlints";
import * as formatter from "./formatting";
import * as symbols from './symbols';
import * as hover from './hover';
import * as codeAction from './codeaction';
import * as completion from './completion';
import * as documentLink from './documentlink';

export function activate(context: ExtensionContext,diagnosticCollectionXQuery:XQLinter) {
    symbols.activate(context);
    hover.activate(context);
    codeAction.activate(context,diagnosticCollectionXQuery);
    completion.activate(context);
    documentLink.activate(context);
    formatter.activate(context);   
}
