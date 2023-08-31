import * as ext from "@quodatum/xqlint";
import { TextDocument,  Range, Uri } from "vscode";

import { Configuration } from ".";
import { channel } from "./channel-basex";

// map of seen documents
const xlints: MapType = {};
type MapType = {
  [id: string]: ext.XQLint;
}

export class XQLintFactory {

  // return xqlint for document

  static XQLint(document: TextDocument, refresh = true): ext.XQLint {
    return XQLintFactory.XQLint2(document.uri, document.getText(), refresh = true)
  }

// 
  static XQLint2(uri: Uri, document: string, refresh = true): ext.XQLint {
    const key = uri.toString();
    let xqlint = xlints[key];
    const isNew = typeof xqlint === "undefined";
    channel.log((isNew ? "🆕" : "") + (refresh ? "♻️": "") + " XQLint@ " + key);
    if (isNew || refresh) {
      const processor = Configuration.xqueryProcessor;
      const opts={ "processor": processor, "fileName": uri.fsPath };
      xqlint = new ext.XQLint(document, opts);
      xlints[key] = xqlint;
    }
    return xqlint;
  }
}


export function importRange(lintRange: ext.LintRange): Range {
  return lintRange?
                  new Range(lintRange.sl, lintRange.sc, lintRange.el, lintRange.ec)
                  :new Range(0,0,0,0);
}