
import { VarDecl, FunDecl} from '@quodatum/xqlint';
import {
  SymbolKind, DocumentSymbol, DocumentSymbolProvider, WorkspaceSymbolProvider,
  Position, Location,Uri,TextDocument, CancellationToken,
  ExtensionContext, languages, SymbolInformation
} from 'vscode';
import { channel,importRange } from "../common";
import { languageIds } from "../constants";
import { xqLinters } from "../extension";
//
// This class handles XQuery Symbols
//

export function activate(context: ExtensionContext) {
  context.subscriptions.push(languages.registerDocumentSymbolProvider(
    { language: languageIds.xquery }, new DocumentSymbols()
  ));
  context.subscriptions.push(languages.registerWorkspaceSymbolProvider(
    new WorkspaceSymbols()
  ));
}
// @TODO 
class WorkspaceSymbols implements WorkspaceSymbolProvider {
  provideWorkspaceSymbols = async (query: string,
    token: CancellationToken): Promise<SymbolInformation[]> => {

    channel.log("WorkspaceSymbols: " + query);
    const symbols: SymbolInformation[] = [];
    const si: SymbolInformation = {
      name: "fred",
      containerName: "",
      kind: SymbolKind.Interface,
      location: new Location(Uri.parse("file://aa"),new Position(0,0))
    };
    symbols.push(si)
    return symbols;
  }
}

export class DocumentSymbols implements DocumentSymbolProvider {
  provideDocumentSymbols = async (
    document: TextDocument,
    token: CancellationToken
  ): Promise<DocumentSymbol[]> => {

    channel.log("DocumentSymbols: " + document.uri);
    const symbols: DocumentSymbol[] = [];

    const linter =   xqLinters.xqlint(document.uri); 

    const xqdoc = linter.getXQDoc(true);
    channel.log("got xqdoc");
    xqdoc.variables.forEach(function (v: VarDecl): void {
      const name = "$" + v.name;
      const description = v?.description;
      //channel.log(name + v);
      const range = importRange( v.pos );
      const info = new DocumentSymbol(name, description, SymbolKind.Variable, range, range);
      symbols.push(info);
    });

    xqdoc.functions.forEach(function (f: FunDecl) {
      const name = f.name + "#" + f.params.length;
      const description = f?.description;
      //channel.log(name );
      const range = importRange( f.pos );
      const info = new DocumentSymbol(name, description, SymbolKind.Function, range, range);
      // info.children=[];
      // f.params.forEach(function(paramName: string){
      //   info.children.push(makeSymbol(paramName, "", SymbolKind.Variable, f.pos))
      // });
      symbols.push(info);
    });
    if(xqdoc.queryBody){
      const range= importRange( xqdoc.queryBody );
      const q = new DocumentSymbol("querybody", "", SymbolKind.Package, range, range);
      symbols.push(q);
    }
    channel.log("Symbols done " + document.uri);
    return symbols;
  };
}
