//UI to pick one
import {
    window,
    QuickPickItem,
    QuickPickItemKind
} from "vscode";

export async function pickOne(items:QuickPickItem[],index :number) :Promise<QuickPickItem|undefined>{
    const picks:QuickPickItem[] = [
            { 
                label: '━━━━━━━━━━━━━━━━━━━━', 
                kind: QuickPickItemKind.Separator 
            }]
    picks.push(...items);
    const quickPick = window.createQuickPick();

    quickPick.items = picks;
    quickPick.title = 'select XQuery execution command ' + index;
    //quickPick.selectedItems = items.filter(item => item.id == active);
    // Show and handle selection
    quickPick.show();
    const result = await new Promise<QuickPickItem | undefined>(resolve => {
        quickPick.onDidAccept(() => {
            resolve(quickPick.selectedItems[0]);
            quickPick.hide();
        });
        quickPick.onDidHide(() => resolve(undefined));
    });
    quickPick.dispose();
    return result;
}