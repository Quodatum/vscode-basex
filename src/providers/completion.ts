import {
    CompletionItem, CompletionItemKind, CompletionItemProvider,
    Position, TextDocument, ExtensionContext, languages
} from "vscode";

import { languageIds } from "../constants";
import { diagnosticCollectionXQuery } from "../extension";

export function activate(context: ExtensionContext) {
    context.subscriptions.push(languages.registerCompletionItemProvider(
        { language: languageIds.xquery }, new XQueryCompletionItemProvider()
    ));
}

class XQueryCompletionItemProvider implements CompletionItemProvider {

    provideCompletionItems(document: TextDocument, position: Position): CompletionItem[] {
        const completionItems = new Array<CompletionItem>();
        const linter = diagnosticCollectionXQuery.xqlint(document.uri);

        linter.getCompletions(position).forEach((x: any) => {
            completionItems.push(this._getCompletionItem(x));
        });

        return completionItems;
    }

    private _getCompletionItem(xqLintCompletionItem: any): CompletionItem {
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

                completionItem.insertText = xqLintCompletionItem.value.substring(funcStart, funcEnd);
                break;

            // variables and parameters (always qualified with a dollar sign)
            case "Let binding":
            case "Local variable":
            case "Window variable":
            case "Function parameter":
                completionItem.kind = CompletionItemKind.Variable;
                completionItem.insertText = xqLintCompletionItem.value.substring(1);
                break;

            // everything else
            default:
                completionItem.kind = CompletionItemKind.Text;
                break;
        }

        return completionItem;
    }

}
