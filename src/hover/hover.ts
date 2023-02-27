// xquery hover

import { CancellationToken, Hover, HoverProvider, Position, TextDocument } from "vscode";
import { factory } from "../common/xqlint";
import { Configuration } from "../common";

export class XQueryHoverProvider implements HoverProvider {
    public provideHover(
        document: TextDocument,
        position: Position,
        token: CancellationToken
    ): Hover | null {
        const linter = factory.XQLint(document.getText());

        const node = linter.getAST(position);
        //const sctx=linter.getCompletions(position);
        //channel.log("Hover: " + node.name);
        //const dx=dump(node);
        //channel.appendLine(dx);
        const range = document.getWordRangeAtPosition(position);

        const word = document.getText(range);
 
        if (Configuration.xqueryShowHovers(document.uri)) {
            return new Hover(`XQuery Hover info: ${word} at ${position.line}: ${position.character}
          value: ${node.value}, name: ${node.name}
           `);
        } else {
            return null; //if there is no information to show
        }
    }
}