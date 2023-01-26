// xquery hover

import { CancellationToken, Hover, HoverProvider, Position, TextDocument } from "vscode";
import { channel } from "../common/logger";

export class XQueryHoverProvider implements HoverProvider {
    public provideHover(
        document: TextDocument, 
        position: Position, 
        token: CancellationToken
    ): Hover | null {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        return new Hover(`Hover info: ${word} at ${position.line}: ${position.character}`);
        // return null; if there is no information to show
    }
}
