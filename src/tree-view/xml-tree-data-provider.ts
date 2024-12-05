import { window, workspace } from "vscode";
import {
   EventEmitter, ExtensionContext, Position, TextEditor, TreeDataProvider,
    TreeItem, TreeItemCollapsibleState
} from "vscode";

import * as path from "path";
import { sync } from 'slimdom-sax-parser';
import * as slimdom from "slimdom";

import { Configuration, NativeCommands, XmlTraverser } from "../common";
import * as constants from "../constants";

export class XmlTreeDataProvider implements TreeDataProvider<never> {
    private _onDidChangeTreeData: EventEmitter<unknown> = new EventEmitter<unknown>();
    private _xmlDocument: slimdom.Document;
    private _xmlTraverser: XmlTraverser;


    constructor(private _context: ExtensionContext) {
        window.onDidChangeActiveTextEditor(() => {
            this._refreshTree();
        });

        workspace.onDidChangeTextDocument(() => {
            this._refreshTree();
        });

        this._refreshTree();
    }

    onDidChangeTreeData = this._onDidChangeTreeData.event;

    get activeEditor(): TextEditor {
        return window.activeTextEditor || null;
    }

    getTreeItem(element: slimdom.Element): TreeItem | Thenable<TreeItem> {
        const enableMetadata = Configuration.enableXmlTreeViewMetadata;
        const enableSync = Configuration.enableXmlTreeViewCursorSync;

        const treeItem = new TreeItem(element.localName);

        if (!this._xmlTraverser.isElement(element)) {
            treeItem.label = `${element.localName} = "${element.nodeValue}"`;
        }

        else if (enableMetadata) {
            const childAttributes = this._xmlTraverser.getChildAttributeArray(<slimdom.Element>element);
            const childElements = this._xmlTraverser.getChildElementArray(<slimdom.Element>element);
            const totalChildren = (childAttributes.length + childElements.length);

            if (totalChildren > 0) {
                treeItem.label += "  (";

                if (childAttributes.length > 0) {
                    treeItem.label += `attributes: ${childAttributes.length}, `;
                    treeItem.collapsibleState = TreeItemCollapsibleState.Collapsed;
                }

                if (childElements.length > 0) {
                    treeItem.label += `children: ${childElements.length}, `;
                    treeItem.collapsibleState = TreeItemCollapsibleState.Collapsed;
                }
                const label = treeItem.label as string;
                treeItem.label = label.substr(0, label.length - 2) + ")";

            }

            if (this._xmlTraverser.hasSimilarSiblings(<slimdom.Element>element) && enableSync) {
                treeItem.label += ` [line ${(element as any).lineNumber}]`;
            }
        }

        treeItem.command = {
            command: constants.nativeCommands.revealLine,
            title: "",
            arguments: [{
                lineNumber: (element as any).lineNumber - 1,
                at: "top"
            }]
        };

        treeItem.iconPath = this._getIcon(element);

        return treeItem;
    }

    getChildren(element?: slimdom.Node): slimdom.Node[] | Thenable<slimdom.Node[]> {
        if (!this._xmlDocument) {
            this._refreshTree();
        }

        if (this._xmlTraverser.isElement(element)) {
            return [].concat(this._xmlTraverser.getChildAttributeArray(<slimdom.Element>element), this._xmlTraverser.getChildElementArray(<slimdom.Element>element));
        }

        else if (this._xmlDocument) {
            return [this._xmlDocument.lastChild];
        }

        else {
            return [];
        }
    }

    getParent(element: slimdom.Node): slimdom.Node {
        if ((!element || !element.parentNode || !element.parentNode.parentNode) && !(element as any).ownerElement) {
            return undefined;
        }

        return element.parentNode || (element as any).ownerElement;
    }

    getNodeAtPosition(position: Position): slimdom.Node {
        return this._xmlTraverser.getNodeAtPosition(position);
    }

    private _getIcon(element: slimdom.Node): any {
        let type = "element";

        if (!this._xmlTraverser.isElement(element)) {
            type = "attribute";
        }

        const icon = {
            dark: this._context.asAbsolutePath(path.join("resources", "icons", `${type}.dark.svg`)),
            light: this._context.asAbsolutePath(path.join("resources", "icons", `${type}.light.svg`))
        };

        return icon;
    }

    private _refreshTree(): void {
        if (!this.activeEditor || this.activeEditor.document.languageId !== constants.languageIds.xml) {
            NativeCommands.setContext(constants.contextKeys.xmlTreeViewEnabled, false);

            this._xmlDocument = null;
            this._onDidChangeTreeData.fire(null);
            return;
        }

        const enableTreeView = Configuration.enableXmlTreeView;

        NativeCommands.setContext(constants.contextKeys.xmlTreeViewEnabled, enableTreeView);

        const xml = this.activeEditor.document.getText();

        try {
            this._xmlDocument = sync(xml);
        }

        catch {
            this._xmlDocument = sync("<InvalidDocument />");
        }

        finally {
            this._xmlTraverser = this._xmlTraverser || new XmlTraverser(this._xmlDocument);
            this._xmlTraverser.xmlDocument = this._xmlDocument;
        }

        this._onDidChangeTreeData.fire(this.activeEditor.document.uri);
    }

}
