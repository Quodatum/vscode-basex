/* eslint-disable @typescript-eslint/no-unused-vars */
import { XQLint } from '@quodatum/xqlint';
import * as vscode from 'vscode';
import { channel } from "../common/logger";
//
// This class handles Symbols
//
function makeSymbol(name: string, description: string, icon: vscode.SymbolKind, pos: any) {
  const spos = new vscode.Position(pos.sl, pos.sc);
  const epos = new vscode.Position(pos.el, pos.ec);
  const fullrange = new vscode.Range(spos, epos);
  const selrange = new vscode.Range(spos, spos);
  return new vscode.DocumentSymbol(name, description, icon, fullrange, selrange);
}

export class Symbols implements vscode.DocumentSymbolProvider {

  provideDocumentSymbols = async (
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentSymbol[]> => {
    channel.log("Symbols: " + document.uri);
    const symbols: vscode.DocumentSymbol[] = [];
    const text = document.getText();
    const linter = new (XQLint as any)(text, { "styleCheck": false });
    const xqdoc = linter.getXQDoc();
    channel.log("got xqdoc");
    // type: type,
    // pos: pos,
    // qname: qname,
    // annotations: {}
    xqdoc.variables.forEach(v => {
      const name = v.name;
      const info = makeSymbol(name, "var", vscode.SymbolKind.Variable, v.pos)
      symbols.push(info);
    });
    xqdoc.functions.forEach(v => {
      const name = v.name;
      const info = makeSymbol(name, "Fu", vscode.SymbolKind.Function, v.pos)
      symbols.push(info);
    });
    channel.log("Symbols done " + document.uri);
    return symbols;
  };
}
