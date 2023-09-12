import { Uri, Tab, TabInputText, window, commands } from "vscode";

//https://stackoverflow.com/questions/44733028/how-to-close-textdocument-in-vs-code/75192905#75192905
export async function closeFileIfOpen(file: Uri): Promise<void> {
    const tabs: Tab[] = window.tabGroups.all.map(tg => tg.tabs).flat();
    const index = tabs.findIndex(tab => tab.input instanceof TabInputText && tab.input.uri.path === file.path);
    if (index !== -1) {
        await window.tabGroups.close(tabs[index]);
    }
}
export class NativeCommands {
    static async cursorMove(to: string, by: string): Promise<void> {
        await commands.executeCommand("cursorMove", {
            to: to,
            by: by
        });
    }

    static openGlobalSettings(): void {
        commands.executeCommand("workbench.action.openGlobalSettings");
    }

    static setContext(key: string, value: any): void {
        commands.executeCommand("setContext", key, value);
    }
}
