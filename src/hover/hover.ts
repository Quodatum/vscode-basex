// xquery hover

import { CancellationToken, Hover, HoverProvider, Position, TextDocument } from "vscode";
import { XQLint} from "@quodatum/xqlint";
import { channel,dump } from "../common/logger";

export class XQueryHoverProvider implements HoverProvider {
    public provideHover(
        document: TextDocument, 
        position: Position, 
        token: CancellationToken
    ): Hover | null {
        const linter = new XQLint(document.getText());
        const posx=position.translate(1,1); //@TODO
        const node=linter.getAST(posx);
        const sctx=linter.getCompletions(posx);
        channel.log("Hover: " + node.name);
        //const dx=dump(node);
        //channel.appendLine(dx);
        const range = document.getWordRangeAtPosition(position);
        
        const word = document.getText(range);
        return new Hover(`XQuery Hover info: ${word} at ${posx.line}: ${posx.character}
          value: ${ node.value }, name: ${ node.name }
           `);

        return null; //if there is no information to show
    }
}
