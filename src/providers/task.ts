import * as vscode from 'vscode';
// https://code.visualstudio.com/api/extension-guides/task-provider

let _basexTaskProvider: vscode.Disposable | undefined;



export class BasexTaskProvider implements vscode.TaskProvider {
	static BasexType = 'basex';
	private basexPromise: Thenable<vscode.Task[]> | undefined = undefined;
	constructor(_workspaceRoot: string) {
		
	}

	public provideTasks() {
		if (!this.basexPromise) {
			this.basexPromise = getBasexTasks();
		}
		return this.basexPromise;
	}
	public resolveTask(_task: vscode.Task): vscode.Task | undefined {
		const script = _task.definition.script;
		// A basex task consists of a task and an optional file as specified in basexTaskDefinition
		// Make sure that this looks like a basex task by checking that there is a task.
		if (script) {
			// resolveTask requires that the same definition object be used.
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const definition: BasexTaskDefinition = <any>_task.definition;
			return new vscode.Task(definition,
				_task.scope ?? vscode.TaskScope.Workspace,
				definition.task,
				BasexTaskProvider.BasexType,
				new vscode.ShellExecution(`basex ${definition.task}`)
			);
		}
		return undefined;
	}
}
interface BasexTaskDefinition extends vscode.TaskDefinition {
	script: string; /** The basex file containing the task */
}

export function activate(): void {
	const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	if (!workspaceRoot) {
		return;
	}

	_basexTaskProvider = vscode.tasks.registerTaskProvider(BasexTaskProvider.BasexType, new BasexTaskProvider(workspaceRoot));
}

async function getBasexTasks(): Promise<vscode.Task[]> {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	const result: vscode.Task[] = [];
	if (!workspaceFolders || workspaceFolders.length === 0) {
		return result;
	}
	for (const workspaceFolder of workspaceFolders) {
		const folderString = workspaceFolder.uri.fsPath;
		if (!folderString) {
			continue;
		}

		const taskName = "test.xq";
		const kind: BasexTaskDefinition = {
			type: 'basex',
			script: taskName
		};
		const task = new vscode.Task(kind, workspaceFolder, taskName, 'basex',
			new vscode.ShellExecution(`basex ${taskName}`));
		result.push(task);
	}

	return result;
}