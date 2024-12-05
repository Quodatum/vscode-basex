import { Position } from "vscode";
import * as slimdom from "slimdom";
import * as slimdom2 from "slimdom-sax-parser";
export class XmlTraverser {

    constructor(private _xmlDocument: slimdom2.Document) { }

    get xmlDocument(): slimdom.Document {
        return this._xmlDocument;
    }

    set xmlDocument(value: slimdom.Document) {
        this._xmlDocument = value;
    }

    getChildAttributeArray(node: slimdom.Element): unknown[] {
        if (!node.attributes) {
            return [];
        }

        const array = new Array<unknown>();

        for (let i = 0; i < node.attributes.length; i++) {
            array.push(node.attributes[i]);
        }

        return array;
    }

    getChildElementArray(element: slimdom.Element): slimdom.Element[] {
        return element.children;

    }

    getElementAtPosition(position: Position): slimdom.Element {
        const node = this.getNodeAtPosition(position);

        return this.getNearestElementAncestor(node);
    }

    getNearestElementAncestor(node: slimdom.Node): slimdom.Element {
        if (!this.isElement) {
            return this.getNearestElementAncestor(node.parentNode);
        }

        return <slimdom.Element>node;
    }

    getNodeAtPosition(position: Position): slimdom.Node {
        return this._getNodeAtPositionCore(position, this._xmlDocument.documentElement);
    }

    getSiblings(node: slimdom.Node): slimdom.Node[] {
        if (this.isElement(node)) {
            return this.getSiblingElements(node);
        }

        return this.getSiblingAttributes(node);
    }

    getSiblingAttributes(node: slimdom.Node): slimdom.Node[] {
        return this.getChildAttributeArray(<slimdom.Element>node.parentNode);
    }

    getSiblingElements(node: slimdom.Node): slimdom.Node[] {
        return this.getChildElementArray(node.parentNode);
    }

    hasSimilarSiblings(node: slimdom.Node): boolean {
        if (!node || !node.parentNode || !this.isElement(node)) {
            return false;
        }

        const siblings = this.getChildElementArray(<slimdom.Element>node.parentNode);

        return (siblings.filter(x => x.tagName === (node as slimdom.Element).tagName).length > 1);
    }

    isElement(node: slimdom.Node): boolean {
        return (!!node && !!(node as slimdom.Element).tagName);
    }

    private _getNodeAtPositionCore(position: Position, contextNode: slimdom.Node): slimdom.Node {
        if (!contextNode) {
            return undefined;
        }

        const lineNumber = contextNode.lineNumber;
        const columnNumber = (contextNode as any).columnNumber;
        const columnRange = [columnNumber, (columnNumber + (this._getNodeWidthInCharacters(contextNode) - 1))];

        // for some reason, xmldom sets the column number for attributes to the "="
        if (!this.isElement(contextNode)) {
            columnRange[0] = (columnRange[0] - contextNode.nodeName.length);
        }

        if (this._checkRange(lineNumber, position, columnRange)) {
            return contextNode;
        }

        if (this.isElement(contextNode)) {
            // if the element contains text, check to see if the cursor is present in the text
            const textContent = (contextNode as slimdom.Element).textContent;

            if (textContent) {
                columnRange[1] = (columnRange[1] + textContent.length);

                if (this._checkRange(lineNumber, position, columnRange)) {
                    return contextNode;
                }
            }

            const children = [...this.getChildAttributeArray(<slimdom.Element>contextNode), ...this.getChildElementArray(contextNode)];
            let result: slimdom.Node;

            for (let i = 0; i < children.length; i++) {
                const child = children[i];

                result = this._getNodeAtPositionCore(position, child);

                if (result) {
                    return result;
                }
            }
        }

        return undefined;
    }

    private _checkRange(lineNumber: number, position: Position, columnRange: number[]): boolean {
        return (lineNumber === (position.line + 1) && ((position.character + 1) >= columnRange[0] && (position.character + 1) < columnRange[1]));
    }

    private _getNodeWidthInCharacters(node: slimdom.Node) {
        if (this.isElement(node)) {
            return (node.nodeName.length + 2);
        }

        else {
            return (node.nodeName.length + node.nodeValue.length + 3);
        }
    }
}
