
import { TextEditor, Selection, window, QuickPickItem } from "vscode";
import { channel } from "../common/channel-basex";
import { Configuration, importRange } from "../common";
import { xqLinters } from "../extension";
import { findNode } from "../common/xqlint";
import { profiles, Profile } from '@quodatum/xqlint';

export async function setProcessor(): Promise<void> {
    const processor = Configuration.xqueryProfile;
    const items: PickProfile[] = profiles().map(item => new PickProfile(item, processor));
    const pick = await window.showQuickPick(items, { title: "Select XQuery profile: " + processor });
    if (pick) {
        channel.log("setProcessor:" + pick.id);
        Configuration.xqueryProfile = pick.id;
    }
}

// select enclosing declaration 
export function selectDeclaration(textEditor: TextEditor): void {
    channel.log("selectDeclaration:");

    const linter = xqLinters.xqlint(textEditor.document.uri);
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
export async function libraryInfo(textEditor: TextEditor): Promise<void> {
    const linter = xqLinters.xqlint(textEditor.document.uri);
    const lib = linter.getLibrary();
    const pick = await window.showQuickPick(Object.keys(lib), 
                      { title: "Select namespace from profile library" });
    if (pick) {
        //lib[pick].functions["http://basex.org/modules/admin#logs#0"]
        console.log("todo: ", (lib as any)[pick ]);
        window.showInformationMessage("libraryInfo: " + pick);
    }
}

class PickProfile implements QuickPickItem {
    label: string;
    description = '';
    picked: boolean;
    id: string;

    constructor(item: Profile, current: string) {
        this.label = `$(package) ${item.id}`;
        this.description = item.description;
        this.id = item.id
        this.picked = item.id === current; // not supported?
    }
}
