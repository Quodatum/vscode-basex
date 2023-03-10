
import {  TextEditor } from "vscode";
import { channel,dump } from "../common/logger";
import  {factory} from "../common/xqlint";

export function xqLintReport(textEditor: TextEditor): void {
    const linter = factory.XQLint(textEditor.document.getText());
    

    textEditor.edit(textEdit => {
        const selections = textEditor.selections;
        selections.forEach(selection => {
            const pos=selection.start.translate(1,1); //@TODO
            const node=linter.getAST(pos);
            const sctx=linter.getCompletions(pos);
            const dx=dump(node);
            channel.appendLine(dx);
        });
    });
}