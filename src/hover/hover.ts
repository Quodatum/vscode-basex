// xquery hover

import { CancellationToken, Hover, HoverProvider, Position, TextDocument } from "vscode";
import { XQLint} from "@quodatum/xqlint";
import { channel } from "../common/logger";

export class XQueryHoverProvider implements HoverProvider {
    public provideHover(
        document: TextDocument, 
        position: Position, 
        token: CancellationToken
    ): Hover | null {
        const linter = new XQLint(document.getText());
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        return new Hover(`XQuery Hover info: ${word} at ${position.line}: ${position.character}`);
        // return null; if there is no information to show
    }
}
