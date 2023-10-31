
'use strict';

import vscode from 'vscode';
import cp = require('child_process');
import path = require('path');


export class XQueryDefinitionProvider  implements vscode.DefinitionProvider {

	private parseDefinitionLocation(output: string, filename: string): vscode.Definition {

		const items: vscode.Location[] = new Array<vscode.Location>();
		output.split(/\r?\n/)
			.forEach(function (value, index, array) {

				if (value !== null && value !== "") {

					const values = value.split(/ +/);

					// Create            113 C:/Users/alefr/Downloads/SynEdit-2_0_8/SynEdit/Source/SynURIOpener.pas constructor Create(AOwner: TComponent); override;
					const word = values.shift();
					const line = parseInt(values.shift()) - 1;

					// together again get the filename (which may contains spaces and the previous shift wouldn't work)
					let filePath: string;
					if (values[ 2 ].indexOf(word + '(') === 0) {
						filePath = path.join(AbstractProvider.basePathForFilename(filename), values.shift());
					} else {
						const rest: string = values.join(' ');
						const idxProc: number = rest.search(/(class\s+)?\b(procedure|function|constructor|destructor)\b/gi);
						filePath = rest.substr(0, idxProc - 1);
						filePath = path.join(AbstractProvider.basePathForFilename(filename), filePath);
					}

					const definition = new vscode.Location(
						vscode.Uri.file(filePath), new vscode.Position(line, 0)
					);

					items.push(definition);
				}

			});

		return items;
	}

	private definitionLocations(word: string, filename: string): Promise<vscode.Definition> {

		return new Promise<vscode.Definition>((resolve, reject) => {

			this.generateTagsIfNeeded(filename)
				.then((value: boolean) => {
					if (value) {

						cp.execFile('global', [ '-x', word ], { cwd: AbstractProvider.basePathForFilename(filename) }, (err, stdout, stderr) => {
							try {
								if (err && (<any>err).code === 'ENOENT') {
									console.log(vscode.l10n.t('The "global" command is not available. Make sure it is on PATH'));
								}
								if (err) return resolve(null);
								const result = stdout.toString();
								// console.log(result);
								const locs = <vscode.Definition>this.parseDefinitionLocation(result, filename);
								return resolve(locs);
							} catch (e) {
								reject(e);
							}
						});
					} else {
						return resolve(null);
					}
				});
		});
	}

	public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.Definition | Thenable<vscode.Definition> {
		const fileName: string = document.fileName;
		const word = document.getText(document.getWordRangeAtPosition(position)).split(/\r?\n/)[0];
		return this.definitionLocations(word, fileName).then(locs => {
			return locs;
		});
	}
}