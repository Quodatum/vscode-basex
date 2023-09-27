// https://code.visualstudio.com/docs/editor/workspaces

import * as path from 'path';
import { Uri, workspace } from 'vscode'


export function basePathForFilename(uri:Uri): string {

    if (workspace.workspaceFolders) {
        return workspace.getWorkspaceFolder(uri).uri.fsPath;
    } else {
        return path.dirname(uri.fsPath);
    }
}
