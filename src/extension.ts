import {
    commands, languages, window, ExtensionContext,
    workspace
} from "vscode";

import { channel, createDocumentSelector, ExtensionState, 
    Configuration, affectsConfiguration } from "./common";
import { activate as secrets } from "./common";
import { activate as statusbar } from "./statusbar";
import { XQLinters, subscribeToDocumentChanges } from "./linters"
//import { activate  as activateActions} from "./xquery-cmds/xqactions";
import { XmlFormatterFactory, XmlFormattingEditProvider } from "./formatting";
import { formatAsXml, minifyXml, xmlToText, textToXml } from "./formatting/commands";
import { xqLintReport, activateVirtualDocs } from "./linting";
//import { XmlTreeDataProvider } from "./tree-view/index.ts.old";
import { evaluateXPath, getCurrentXPath } from "./xpath/commands";

import { registerXQueryCommands} from "./xquery-cmds";

import * as constants from "./constants";
import * as providers from "./providers/activate";


export const xqLinters = new XQLinters();
//const actionDiagnostics = languages.createDiagnosticCollection(constants.diagnosticCollections.xqActions);

export function activate(context: ExtensionContext) {
    channel.log("Extension activate");
    secrets(context);
    ExtensionState.configure(context);
    statusbar(context, xqLinters);
    //activateActions(context,actionDiagnostics);
    /* activate XQuery handlers */
    providers.activate(context, xqLinters);
    activateVirtualDocs(context);
    /* Linting Features */
    subscribeToDocumentChanges(context, xqLinters);

    /* XML Formatting Features */
    const xmlXsdDocSelector = [
        ...createDocumentSelector(constants.languageIds.xml),
        ...createDocumentSelector(constants.languageIds.xsd)];
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
    /* Tree View Features
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
    */
    /* XPath Features */
    context.subscriptions.push(
        commands.registerTextEditorCommand(constants.commands.evaluateXPath, evaluateXPath),
        commands.registerTextEditorCommand(constants.commands.getCurrentXPath, getCurrentXPath)
    );

    /* XQuery Features */
    registerXQueryCommands(context);
   

    // if changes to processor  then clear diagnostics
    workspace.onDidChangeConfiguration(event => {
        if (affectsConfiguration(event,'xquery.profile')) {
            xqLinters.clear();
            window.showInformationMessage("XQuery profile now: " + Configuration.xqueryProfile);
        } else if(affectsConfiguration(event,'xquery.showHovers')){
            window.showInformationMessage("XQuery hover diagnostics : " + Configuration.xqueryShowHovers)
        }
    })
}

export function deactivate() {
    channel.log("deactivate");
}
