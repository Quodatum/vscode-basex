/* eslint-disable @typescript-eslint/no-unused-vars */
import { VarDecl, FunDecl} from '@quodatum/xqlint';
import {SymbolKind, DocumentSymbol, DocumentSymbolProvider,
        Range, Position, TextDocument,CancellationToken}  from 'vscode';
import { channel } from "../common/logger";
import  {factory} from "../common/xqlint";
//
// This class handles XQuery Symbols
//
function makeSymbol(name: string, description: string, icon: SymbolKind, pos: any) {
  const spos = new Position(pos.sl, pos.sc);
  const epos = new Position(pos.el, pos.ec);
  const fullrange = new Range(spos, epos);
  const selrange = new Range(spos, spos);
  return new DocumentSymbol(name, description, icon, fullrange, selrange);
}


export class Symbols implements DocumentSymbolProvider {
  provideDocumentSymbols = async (
    document: TextDocument,
    token: CancellationToken
  ): Promise<DocumentSymbol[]> => {

    channel.log("Symbols: " + document.uri);
    const symbols: DocumentSymbol[] = [];
    const text = document.getText();
    const linter =factory.XQLint(text);

    const xqdoc = linter.getXQDoc();
    channel.log("got xqdoc");
   
    // type: type,
    // pos: pos,
    // qname: qname,
    // annotations: {}
    xqdoc.variables.forEach(function (v: VarDecl): void {
      const name = "$" + v.name;
      const description="about this variable, some doc here";
      channel.log(name + v);
      const info = makeSymbol(name, description, SymbolKind.Variable, v.pos);
      symbols.push(info);
    });

    xqdoc.functions.forEach(function (f: FunDecl) {
      const name = f.name + "#" + f.params.length;
      const description="about this function, some doc here";
      channel.log(name + f);
      const info = makeSymbol(name, description, SymbolKind.Function, f.pos);
      // info.children=[];
      // f.params.forEach(function(paramName: string){
      //   info.children.push(makeSymbol(paramName, "", SymbolKind.Variable, f.pos))
      // });
      symbols.push(info);
    });
  
    channel.log("Symbols done " + document.uri);
    return symbols;
  };
}
