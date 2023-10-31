import { Ast, LintRange, XQLint } from "@quodatum/xqlint";
import { Position, Range } from "vscode";


export function importRange(lintRange?: LintRange): Range {
    return lintRange ?
        new Range(lintRange.sl, lintRange.sc, lintRange.el, lintRange.ec)
        : new Range(0, 0, 0, 0);
}
// return 1st ancestor node with name or undefined
export function findNode(node: Ast, nodeName: string): Ast | undefined {
    let n2 = node;
    while (n2 !== null) {
        if (n2.name === nodeName) return n2;
        n2 = n2.getParent;
    }
}
// array of AST node names upto root
export function astPath(node: Ast): string[] {
    const path: string[] = [];
    let n = node;
    while (n != null) {
        path.push(n.name);
        n = n.getParent;
    }
    return path;
}


// metadata about given AST node {type:,path:}
export function inspectAst(linter: XQLint, position: Position) {
    const node = linter.getAST(position);
    const path = astPath(node);
    const r = {
        path: path,
        type: 'other',
        name: node.name,
        value: node.value
    };
    if (node.name === 'WS') {
        r.type = 'WS';
    } else {
        const ps = path.join("/");
        if (ps.startsWith("EQName/FunctionEQName/FunctionCall/")) {
            r.type = "FunctionCall";
            //@todo arity 
        } else if (ps.startsWith("EQName/VarName/VarRef")) {
            r.type = "VarRef";
            r.value = '$' + r.value;
        } else if (path.includes("SequenceType")) {
            r.type = "SequenceType";
        } else if (path.includes("Annotation")) {
            r.type = "Annotation";
        }
    }
    return r;
}