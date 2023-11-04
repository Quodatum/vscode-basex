
import { TextEditor, Selection, window, QuickPickItem } from "vscode";
import { channel } from "../common/channel-basex";
import { Configuration, importRange } from "../common";
import { diagnosticCollectionXQuery } from "../extension";
import { findNode } from "../common/xqlint";
import { profiles, Profile} from '@quodatum/xqlint';

export async function setProcessor(): Promise<void> {
    const processor = Configuration.xqueryProcessor;
    const items:PickProfile[]=profiles().map(item =>  new PickProfile(item,processor));
    const pick=await window.showQuickPick(items,{title:"Select XQuery profile: "+processor});
    if(pick) {
        channel.log("setProcessor:" + pick.id);
        Configuration.xqueryProcessor = pick.id;
    }  
}

// select enclosing declaration 
export function selectDeclaration(textEditor: TextEditor): void {
    channel.log("selectDeclaration:");

    const linter = diagnosticCollectionXQuery.xqlint(textEditor.document.uri);
    const pos = textEditor.selection.start;
    const node = linter.getAST(pos);
    const n2 = findNode(node, "AnnotatedDecl");
    if (n2) {
        const range = importRange(n2.pos);
        // include following ;
        textEditor.selection = new Selection(range.start, range.end.translate(0, 1));
    } else {
        window.showInformationMessage("select declaration - No enclosing declaration")
    }

}

// about the library ;
export function libraryInfo(textEditor: TextEditor): void {
    const linter = diagnosticCollectionXQuery.xqlint(textEditor.document.uri);
    const lib=linter.getLibrary();
    console.log("todo: ", lib );
    window.showInformationMessage("libraryInfo @todo")
}

class PickProfile implements QuickPickItem {
    label: string;
    description = '';
    picked: boolean;
    id: string;

    constructor(item:Profile,current :string) {
      this.label = `$(package) ${item.id}`;
      this.description=item.description;
      this.id=item.id
      this.picked=item.id===current; // not supported?
    }
  }
