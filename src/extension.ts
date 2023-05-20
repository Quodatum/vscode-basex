import {
    commands, languages, window, ExtensionContext,
    TextEditor, TextEditorSelectionChangeEvent, TextEditorSelectionChangeKind, DiagnosticCollection
} from "vscode";
import { channel } from "./common/channel-basex";

import { createDocumentSelector, ExtensionState, Configuration } from "./common";
import { XmlFormatterFactory, XmlFormattingEditProvider } from "./formatting";
import { formatAsXml, minifyXml, xmlToText, textToXml } from "./formatting/commands";
import { XQueryLinter, xqLintReport } from "./linting";
import { XmlTreeDataProvider } from "./tree-view";
import { evaluateXPath, getCurrentXPath } from "./xpath/commands";
import { executeXQuery } from "./xquery-execution/commands";

import * as constants from "./constants";
import * as formatter from "./providers/formatting";
import * as symbols from './providers/symbols';
import * as hover from './providers/hover';
import * as completion from './providers/completion';
import * as documentLink from './providers/documentlink';

let diagnosticCollectionXQuery: DiagnosticCollection;

export function activate(context: ExtensionContext) {
    channel.log("Extension activate");
    ExtensionState.configure(context);
   

    /* activate XQuery handlers */
    symbols.activate(context);
    hover.activate(context);
    completion.activate(context);
    documentLink.activate(context);
    formatter.activate(context);

    /* Linting Features */
    diagnosticCollectionXQuery = languages.createDiagnosticCollection(constants.diagnosticCollections.xquery);
    context.subscriptions.push(
        diagnosticCollectionXQuery,
        window.onDidChangeActiveTextEditor(_handleChangeActiveTextEditor),
        window.onDidChangeTextEditorSelection(_handleChangeTextEditorSelection)
    );

     /* XML Formatting Features */
     const xmlXsdDocSelector = [...createDocumentSelector(constants.languageIds.xml), ...createDocumentSelector(constants.languageIds.xsd)];
     const xmlFormattingEditProvider = new XmlFormattingEditProvider(XmlFormatterFactory.getXmlFormatter());
     context.subscriptions.push(
         commands.registerTextEditorCommand(constants.commands.formatAsXml, formatAsXml),
         commands.registerTextEditorCommand(constants.commands.xmlToText, xmlToText),
         commands.registerTextEditorCommand(constants.commands.textToXml, textToXml),
         commands.registerTextEditorCommand(constants.commands.minifyXml, minifyXml),
         commands.registerTextEditorCommand(constants.commands.xqLintReport, xqLintReport),
 
         languages.registerDocumentFormattingEditProvider(xmlXsdDocSelector, xmlFormattingEditProvider),
         languages.registerDocumentRangeFormattingEditProvider(xmlXsdDocSelector, xmlFormattingEditProvider),
 
     );
    /* Tree View Features */
    const treeViewDataProvider = new XmlTreeDataProvider(context);
    const treeView = window.createTreeView<Node>(constants.views.xmlTreeView, {
        treeDataProvider: treeViewDataProvider
    });

    if (Configuration.enableXmlTreeViewCursorSync) {
        window.onDidChangeTextEditorSelection(x => {
            if (x.kind === TextEditorSelectionChangeKind.Mouse && x.selections.length > 0) {
                treeView.reveal(treeViewDataProvider.getNodeAtPosition(x.selections[0].start));
            }
        });
    }

    context.subscriptions.push(
        treeView
    );

    /* XPath Features */
    context.subscriptions.push(
        commands.registerTextEditorCommand(constants.commands.evaluateXPath, evaluateXPath),
        commands.registerTextEditorCommand(constants.commands.getCurrentXPath, getCurrentXPath)
    );

    /* XQuery Features */
    context.subscriptions.push(
        commands.registerTextEditorCommand(constants.commands.executeXQuery, executeXQuery),
        commands.registerTextEditorCommand(constants.commands.clearDiagnostics, clearDiagnostics),
    );

}

export function deactivate() {
    // do nothing
}

function clearDiagnostics():void{
    diagnosticCollectionXQuery.clear();
    channel.log("diagnosticCollectionXQuery.clear()");
}

function _handleContextChange(editor: TextEditor): void {
    const supportedSchemes = [constants.uriSchemes.file, constants.uriSchemes.untitled];

    if (!editor || !editor.document || supportedSchemes.indexOf(editor.document.uri.scheme) === -1) {
        return;
    }

    switch (editor.document.languageId) {
        case constants.languageIds.xquery:
            diagnosticCollectionXQuery.set(editor.document.uri, new XQueryLinter().lint(editor.document));
            break;
    }
}

function _handleChangeActiveTextEditor(editor: TextEditor): void {
    _handleContextChange(editor);
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _handleChangeTextEditorSelection(e: TextEditorSelectionChangeEvent): void {
    console.log("ChangeTextEditorSelection: ", e.textEditor.document.uri);
    _handleContextChange(e.textEditor);
}
