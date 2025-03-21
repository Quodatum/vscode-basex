import { Position } from "vscode";
import * as slimdom from "slimdom";

export class XmlTraverser {

    constructor(private _xmlDocument: slimdom.Document) { }

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

   

    getNearestElementAncestor(node: slimdom.Node): slimdom.Element {
        if (!this.isElement) {
            return this.getNearestElementAncestor(node.parentNode);
        }

        return <slimdom.Element>node;
    }

 

  

    isElement(node: slimdom.Node): boolean {
        return (!!node && !!(node as slimdom.Element).tagName);
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
