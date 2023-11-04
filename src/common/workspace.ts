// https://code.visualstudio.com/docs/editor/workspaces

import * as path from 'path';
import { ConfigurationChangeEvent, ConfigurationScope, Uri, WorkspaceFolder, workspace } from 'vscode'
import { ExtensionTopLevelSection } from '../common'

export function basePathForFilename(uri:Uri): string {
    if (workspace.workspaceFolders) {
        return workspace.getWorkspaceFolder(uri).uri.fsPath;
    } else {
        return path.dirname(uri.fsPath);
    }
}
export function scope(): ConfigurationScope {
    return (workspace.workspaceFolders as WorkspaceFolder[])[0]
}

// true if config change event effects section 
export function affectsConfiguration(event:ConfigurationChangeEvent,section:string):boolean {
    return event.affectsConfiguration(`${ExtensionTopLevelSection}.${section}`);
}