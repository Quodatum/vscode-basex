/* eslint-disable @typescript-eslint/no-unused-vars */
import { XQLint } from '@quodatum/xqlint';
import {SymbolKind, DocumentSymbol, DocumentSymbolProvider,
        Range, Position, TextDocument,CancellationToken}  from 'vscode';
import { channel } from "../common/logger";
//
// This class handles Symbols
//
function makeSymbol(name: string, description: string, icon: SymbolKind, pos: any) {
  const spos = new Position(pos.sl, pos.sc);
  const epos = new Position(pos.el, pos.ec);
  const fullrange = new Range(spos, epos);
  const selrange = new Range(spos, spos);
  return new DocumentSymbol(name, description, icon, fullrange, selrange);
}
export type VarTypes = {
  name: string;
  pos: any;
};
export type FunTypes = {
  name: string;
  params: any; //@todo
  pos: boolean;
};

export class Symbols implements DocumentSymbolProvider {
  provideDocumentSymbols = async (
    document: TextDocument,
    token: CancellationToken
  ): Promise<DocumentSymbol[]> => {

    channel.log("Symbols: " + document.uri);
    const symbols: DocumentSymbol[] = [];
    const text = document.getText();
    const linter = new (XQLint as any)(text, { "styleCheck": false });

    const xqdoc = linter.getXQDoc();
    channel.log("got xqdoc");
    const prolog=new Range(0,0,0,0)
    symbols.push(makeSymbol(xqdoc.moduleNamespace || "Main", xqdoc.description, SymbolKind.Module, prolog))

    let vars=makeSymbol("Variables", "", SymbolKind.Variable, prolog)
    vars.children=[]
    // type: type,
    // pos: pos,
    // qname: qname,
    // annotations: {}
    xqdoc.variables.forEach(function (v: VarTypes): void {
      const name = v.name;
      const info = makeSymbol(name, "", SymbolKind.Variable, v.pos);
      vars.children.push(info);
    });

    const funs=makeSymbol("Variables", "", SymbolKind.Function, prolog)
    funs.children=[]
    xqdoc.functions.forEach(function (f: FunTypes) {
      const name = f.name + "#" + f.params.length;
      const info = makeSymbol(name, "", SymbolKind.Function, f.pos);
      funs.children.push(info);
    });
    symbols.push(vars)
    symbols.push(funs)
    channel.log("Symbols done " + document.uri);
    return symbols;
  };
}
