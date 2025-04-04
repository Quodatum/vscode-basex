//UI to pick one
import { window, QuickPickItem, ThemeIcon } from "vscode";

export async function pickOne(items: QuickPickItem[], index: number): Promise<QuickPickItem | undefined> {

    // move last used to top
    arraymove(items, index < 0 ? 0 : index, 0);
    const quickPick = window.createQuickPick();
    quickPick.items = items;
    quickPick.title = "Run XQuery using...";
    quickPick.placeholder = 'Filter commands... ' + index;
    quickPick.buttons = [
        {
            iconPath: new ThemeIcon('add'),
            tooltip: 'Add new run option..'
        }
    ];
    quickPick.onDidTriggerButton(_button => {
        // Handle button click
        window.showErrorMessage(`quickPick.onDidTriggerButton`);
    });
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

// move item in array
function arraymove(arr: QuickPickItem[], fromIndex: number, toIndex: number) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}