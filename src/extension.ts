import {
    commands, languages, window, ExtensionContext,
    TextEditorSelectionChangeKind, workspace
} from "vscode";

import { channel, createDocumentSelector, ExtensionState, Configuration } from "./common";

import { XQueryDiagnostics, subscribeToDocumentChanges } from "./xqdiagnostics"

import { XmlFormatterFactory, XmlFormattingEditProvider } from "./formatting";
import { formatAsXml, minifyXml, xmlToText, textToXml } from "./formatting/commands";
import { xqLintReport, activateVirtualDocs } from "./linting";
import { XmlTreeDataProvider } from "./tree-view";
import { evaluateXPath, getCurrentXPath } from "./xpath/commands";

import { setProcessor, selectDeclaration, executeXQuery } from "./xquery-cmds";

import * as constants from "./constants";
import * as formatter from "./providers/formatting";
import * as symbols from './providers/symbols';
import * as hover from './providers/hover';
import * as completion from './providers/completion';
import * as documentLink from './providers/documentlink';

export const diagnosticCollectionXQuery=new XQueryDiagnostics();

export function activate(context: ExtensionContext) {
    channel.log("Extension activate");
    ExtensionState.configure(context);

    /* Linting Features */
    subscribeToDocumentChanges(context, diagnosticCollectionXQuery);

    /* activate XQuery handlers */
    symbols.activate(context);
    hover.activate(context);
    completion.activate(context);
    documentLink.activate(context);
    formatter.activate(context);

    activateVirtualDocs(context);




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
        commands.registerTextEditorCommand(constants.commands.xqExecute, executeXQuery),
        commands.registerTextEditorCommand(constants.commands.xqSelectDeclaration, selectDeclaration),
        commands.registerCommand(constants.commands.xqProcessor, setProcessor),
        commands.registerCommand(constants.commands.xqClearDiagnostics, diagnosticCollectionXQuery.clear),
    );

    // if changes to processor  then clear diagnostics
    workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration("basexTools.xquery.processor")) {
            diagnosticCollectionXQuery.clear();
            window.showInformationMessage("Processor now: " + Configuration.xqueryProcessor);
        }
    })
    window.showInformationMessage("XQuery processor: " + Configuration.xqueryProcessor);
}

export function deactivate() {
    channel.log("deactivate");
}




