import { Ast, LintRange, QName, Sctx, XQLint } from "@quodatum/xqlint";
import { Position, Range, MarkdownString } from "vscode";


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

export interface What {
    path: string[]; // AST
    type: WhatType;
    value: string;
    qname?: QName
    display?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get?: any;
}
// 
export enum WhatType {
    other = "other",
    WS = "WS",
    VarRef = "VarRef",
    FunctionCall = "FunctionCall",
    NamedFunctionRef = "NamedFunctionRef",
    SequenceType = "SequenceType",
    Annotation = "Annotation",
    Constructor = "Constructor",
    StringConstructor = "StringConstructor",
    Literal = "Literal",
    ModuleImport="ModuleImport"
}
// metadata about given AST node {type:,path:}
export function inspectAst(linter: XQLint, position: Position): What {
    const pos: Position = position.translate(0, 1)
    const node = linter.getAST(pos);
    const sctx = linter.getSctx(pos);
    const path = astPath(node);
    const what: What = {
        path: path,
        type: WhatType.other,
        value: node?.value,
        get: {}
    };
    if (!node) return what;
    if (node.name === 'WS') {
        what.type = WhatType.WS;
    } else {
        const ps = path.join("/");
        if (ps.startsWith("URIQualifiedName/FunctionEQName/FunctionCall/")){
            const arity = calcArity(ancestor(node, "FunctionCall"));
            fnUpdate(what, arity, sctx, position);
        } else if (ps.startsWith("EQName/FunctionEQName/FunctionCall/")) {
            const arity = calcArity(ancestor(node, "FunctionCall"));
            fnUpdate(what, arity, sctx, position);

        } else if (ps.startsWith("EQName/ArrowFunctionSpecifier/")) {
            const arity = calcArity(ancestor(node, "ArrowFunctionSpecifier"));
            fnUpdate(what, arity, sctx, position);

        } else if (ps.startsWith("EQName/VarName/VarRef/")) {
            what.type = WhatType.VarRef;
            const qname = sctx.resolveQName(what.value, position);
            what.qname = qname;
            const v = sctx.getVariable(qname);
            what.value = '$' + what.value;
            what.get = v;

        } else if (path.includes("NamedFunctionRef")) {
            const arity = getArity(ancestor(node, "NamedFunctionRef"));
            fnUpdate(what, arity, sctx, position);
            what.type = WhatType.NamedFunctionRef;

        } else if (path.includes("ModuleImport")) {
            what.type = WhatType.ModuleImport;

        } else if (path.includes("SequenceType")) {
            what.type = WhatType.SequenceType;

        } else if (path.includes("Annotation")) {
            what.type = WhatType.Annotation;

        } else if (path.includes("Constructor")) {
            what.type = WhatType.Constructor;
            what.value = "~~constructor";

        } else if (path.includes("StringConstructor")) {
            what.type = WhatType.StringConstructor;
            what.value = "``[..";

        } else if (path.includes("Literal")) {
            what.type = WhatType.Literal;

        }
    }
    return what;
}

// Calculate Arity from functioncall or ArrowFunctionSpecifier
function calcArity(node: Ast): number {
    if (node.name === "ArrowFunctionSpecifier") {
        // find following arglist
        const childs = node.getParent.children;
        const pos = childs.indexOf(node);
        return 1 + get(childs[1 + pos], ['Argument']).length;
    } else {
        return get(node, ['ArgumentList', 'Argument']).length;
    }
}
// expect NamedFunctionRef
function getArity(node: Ast): number {
    return Number(node.children[2].value);
}

//update What for function
function fnUpdate(what: What, arity: number, sctx: Sctx, position: Position) {
    what.type = WhatType.FunctionCall;
    const qname = sctx.resolveQName(what.value, position);
    what.qname = qname;
    const isJava = qname.uri.startsWith("java:");
    if (isJava) {
        what.display = "JAVA: " + qname.uri.substring(5);
    } else {
        const lib = sctx.getFunction(qname, arity);
        if (!lib) {
            console.log("not found: ", qname, arity)
        } else {
            what.get = lib;
            let result = lib?.return;
            result = result ?? lib?.type;

            what.display = what.value
                + "( " + what.get?.params.join(", ") + " )"
                + (result ? " as " + result : "");
        }
    }
}

export function markdownString(value: string): MarkdownString {
    const s = new MarkdownString(value);
    s.supportHtml = true;
    s.isTrusted = true;
    return s
}

// return 1st ancestor node with name or undefined
function ancestor(node: Ast, nodeName: string) {
    let n2 = node;
    while (n2) {
        if (n2.name === nodeName) { return n2; }
        n2 = n2.getParent;
    }
}

// var arity = get(node, ['ArgumentList', 'Argument']).length;
function get(node: Ast, path: string[]): Ast[] {
    let result: Ast[] = [];
    if (path.length === 0) {
        return [node]
    }
    node.children.forEach(function (child) {
        if (child.name === path[0] && path.length > 1) {
            result = get(child, path.slice(1));
        } else if (child.name === path[0]) {
            result.push(child);
        }
    });
    return result;
}

