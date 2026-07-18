
import { VarDecl, FunDecl } from '@quodatum/xqlint';
import {
  SymbolKind, DocumentSymbol, DocumentSymbolProvider, WorkspaceSymbolProvider,
  Position, Location, Uri, TextDocument, CancellationToken,
  ExtensionContext, languages, SymbolInformation
} from 'vscode';
import { channel, importRange,fullRange } from "../common";
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

export class DocumentSymbols implements DocumentSymbolProvider {
  provideDocumentSymbols = async (
    document: TextDocument,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token: CancellationToken
  ): Promise<DocumentSymbol[]> => {

    channel.log("DocumentSymbols: " + document.uri);


    const linter = xqLinters.xqlint(document.uri);
    const xqdoc = linter.getXQDoc(true);
    channel.log("got xqdoc");

    const symbols: DocumentSymbol[] = [];
    const range=fullRange(document);
    const name=xqdoc.prefixes[0] ?? "local";
    const mod=new DocumentSymbol(name, xqdoc?.ns, SymbolKind.Module, range, range);
    symbols.push(mod);
    
      xqdoc.variables.forEach(function (v: VarDecl): void {
        const name = "$" + v.name;
        const description = v?.description;
        //channel.log(name + v);
        const range = importRange(v.pos);
        const info = new DocumentSymbol(name, description, SymbolKind.Variable, range, range);
        symbols.push(info);
      });
     
      xqdoc.functions.forEach(function (f: FunDecl) {
        const name = f.name + " #" + f.params.length;
        const description = f?.description;
        //channel.log(name );
        const range = importRange(f.pos);
        const info = new DocumentSymbol(name, description, SymbolKind.Function, range, range);
        // info.children=[];
        // f.params.forEach(function(paramName: string){
        //   info.children.push(makeSymbol(paramName, "", SymbolKind.Variable, f.pos))
        // });
        symbols.push(info);
      });
     

    if (xqdoc.queryBody) {
      const range = importRange(xqdoc.queryBody);
      const q = new DocumentSymbol("querybody", "", SymbolKind.Package, range, range);
      mod.children.push(q);
    }
    channel.log("Symbols done " + document.uri);
    return symbols;
  };
}

// @TODO 
class WorkspaceSymbols implements WorkspaceSymbolProvider {
  provideWorkspaceSymbols = async (query: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token: CancellationToken): Promise<SymbolInformation[]> => {

    channel.log("WorkspaceSymbols: " + query);
    const symbols: SymbolInformation[] = [];
    const si: SymbolInformation = {
      name: "fred",
      containerName: "",
      kind: SymbolKind.Interface,
      location: new Location(Uri.parse("file://aa"), new Position(0, 0))
    };
    symbols.push(si)
    return symbols;
  }
}
