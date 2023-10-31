import {
    CompletionItem, CompletionItemKind, CompletionItemProvider,CompletionContext,
    Position, TextDocument, ExtensionContext, languages, CompletionList,CancellationToken
} from "vscode";

import { languageIds } from "../constants";
import { createDocumentSelector } from '../common';
import { diagnosticCollectionXQuery } from "../extension";
import { XQLintCompletion as XQLintCompletionItem} from '@quodatum/xqlint';

export function activate(context: ExtensionContext) {
    const obj={
        provideCompletionItems: async (document: TextDocument, position: Position, 
            token: CancellationToken, context: CompletionContext)
            : Promise<CompletionList> => {
            const linter = diagnosticCollectionXQuery.xqlint(document.uri);

            const completionItems = new Array<CompletionItem>();
            linter.getCompletions(position).forEach((x: XQLintCompletionItem) => {
                completionItems.push(_getCompletionItem(x));
            });

            const res = new CompletionList( completionItems,true);
            return res;
        }
    };

    context.subscriptions.push(languages.registerCompletionItemProvider(
        createDocumentSelector(languageIds.xquery), obj
    ));
}

function _getCompletionItem(xqLintCompletionItem: XQLintCompletionItem): CompletionItem {
        const completionItem = new CompletionItem(xqLintCompletionItem.name);
        completionItem.insertText = xqLintCompletionItem.snippet;

        switch (xqLintCompletionItem.meta) {
            // functions (always qualified with a colon)
            case "function":
                completionItem.kind = CompletionItemKind.Function;

                // eslint-disable-next-line no-case-declarations
                const funcStart = (xqLintCompletionItem.value.indexOf(":") + 1);
                // eslint-disable-next-line no-case-declarations
                const funcEnd = xqLintCompletionItem.value.indexOf("(");
                //completionItem.commitCharacters=["("];
                completionItem.documentation="Some documentation about "+ xqLintCompletionItem.value;
                completionItem.insertText = xqLintCompletionItem.value.substring(funcStart, funcEnd);
                break;

            // variables and parameters (always qualified with a dollar sign)
            case "Let binding":
            case "Local variable":
            case "Window variable":
            case "Function parameter":
                completionItem.kind = CompletionItemKind.Variable;
                completionItem.insertText = xqLintCompletionItem.value.substring(1);
                completionItem.detail="A " +xqLintCompletionItem.meta;
                break;
            case "prefix":
                completionItem.kind = CompletionItemKind.Class;
                completionItem.detail="A namespace prefix";
                break;
            case "type":
                completionItem.kind = CompletionItemKind.TypeParameter;
                break;    
            // everything else
            default:
                completionItem.kind = CompletionItemKind.Text;
                break;
        }

        return completionItem;
    }


