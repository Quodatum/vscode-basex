
import { TextEditor, Selection, window } from "vscode";
import { channel } from "../common/channel-basex";
import { Configuration,importRange  } from "../common";
import { diagnosticCollectionXQuery } from "../extension";

export async function setProcessor(): Promise<void> {
    const processor = Configuration.xqueryProcessor;
    const name = await window.showInputBox({
        prompt: "processor",
        value: processor
    });
    if (name) {
        channel.log("setProcessor:" + name);
        Configuration.xqueryProcessor = name;
    }
}

// select enclosing declaration 
export function selectDeclaration(textEditor: TextEditor): void {
    channel.log("selectDeclaration:");
    
    const linter =   diagnosticCollectionXQuery.xqlint(textEditor.document.uri); 
    const pos = textEditor.selection.start;
    const node = linter.getAST(pos);
    const n2=findNode(node,"AnnotatedDecl");
    if(n2){
        const range=importRange(n2.pos);
        // include following ;
        textEditor.selection = new Selection(range.start, range.end.translate(0,1));
    }else{
        window.showInformationMessage("select declaration - No enclosing declaration")
    }

}

// about the library ;
export function libraryInfo(textEditor: TextEditor): void {
 const linter =   diagnosticCollectionXQuery.xqlint(textEditor.document.uri); 
  console.log("todo");
  window.showInformationMessage("libraryInfo @todo")
}

// return 1st ancestor node with name or undefined
function findNode(node :any,nodeName :string):any{
    let n2 = node;  
    while (n2 !== null) {
        if(n2.name === nodeName) return n2;
        n2 = n2.getParent;
    }
} 